import * as R from 'ramda';
import bunyan from 'bunyan';
import { v4 as uuid } from 'uuid';
import { RequestAPI, Request, CoreOptions, UriOptions } from 'request';
import requestDebug, { LogData, LogPhase } from 'request-debug';

import { LoggerContext, IRequestLogger } from '../../types';

export class RequestLogger implements IRequestLogger {
  private logger: bunyan;

  constructor (context: LoggerContext) {
    this.logger = context.logger.child({
      origin: 'Request',
    });
  }

  /**
   * Attaches a debug for request package
   * @param requestPackage Request package to attach debug
   */
  attachDebug(requestPackage: RequestAPI<Request, CoreOptions, UriOptions>): void {
    requestDebug(requestPackage, this.treatLog.bind(this));
  }

  private treatLog(phase: LogPhase, data: LogData) {
    const __type__ = phase === 'request' ? 'Request' : 'Response';
    // @ts-ignore
    const requestId = data.__requestId__ || uuid();
    // @ts-ignore
    data.__requestId__ = requestId;

    const basicData = {
      requestId,
      type: __type__,
    };

    let body = {};
    try {
      // @ts-ignore
      body = JSON.parse(data.body);
    } catch (error) {
      // @ts-ignore
      body = data.body;
    }

    this.logger.info(R.pipe(
      R.mergeDeepLeft(body),
      R.mergeDeepLeft(basicData),
      JSON.stringify,
    )(data));
  }
}
