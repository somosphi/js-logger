import * as R from 'ramda';
import bunyan from 'bunyan';
import { v4 as uuid } from 'uuid';
import { RequestAPI, Request, CoreOptions, UriOptions } from 'request';
import requestDebug, { LogData, LogPhase } from 'request-debug';

import { ILoggerContext, IRequestLogger } from '../types';

export class RequestLogger implements IRequestLogger {
  private logger: bunyan;
  private _cache: Map<number, string>;

  constructor(context: ILoggerContext) {
    this.logger = context.logger.child({
      origin: 'Request',
    });
    this._cache = new Map();
  }

  /**
   * Attaches a debug for request package
   * @param requestPackage Request package to attach debug
   */
  attachDebug = (requestPackage: RequestAPI<Request, CoreOptions, UriOptions>): void => {
    requestDebug(requestPackage, this.treatLog);
  }

  private log = (data: object) => this.logger.info(JSON.stringify(data));

  private logRequest = (data: LogData): object => {
    const reqId = uuid();
    this._cache.set(data.debugId, reqId);

    const base = {
      requestId: reqId,
      type: 'Request',
    };

    return R.mergeDeepLeft(base, data);
  }

  private logResponse = (data: LogData): object => {
    const reqId = this._cache.get(data.debugId);
    this._cache.delete(data.debugId);

    const base = {
      requestId: reqId,
      type: 'Response',
    };

    return R.mergeDeepLeft(base, data);
  }

  private parseBody = (data: LogData) => {
    let body = {};
    try {
      body = R.pipe(
        R.propOr({}, 'body'),
        JSON.parse,
      )(data);
    } catch (err) {
      body = R.propOr({}, 'body', data);
    }

    // @ts-ignore
    data.body = body;
  }

  private treatLog = (phase: LogPhase, data: LogData) => {
    let treatFunc = (obj: LogData): object => ({});
    if (phase === 'request') {
      treatFunc = this.logRequest;
    } else {
      treatFunc = this.logResponse;
    }

    return R.pipe(
      R.tap(this.parseBody),
      treatFunc,
      R.omit(['debugId']),
      this.log,
    )(data);
  }
}
