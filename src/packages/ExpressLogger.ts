/* eslint-disable @typescript-eslint/ban-ts-ignore */
import bunyan from 'bunyan';
import * as R from 'ramda';
import { v4 as uuid } from 'uuid';
import { Request, Response, NextFunction } from 'express';
import { pathToRegexp } from 'path-to-regexp';

import {
  IExpressLogger,
  LoggerContext,
  RedactClass,
  LoggerConfig,
} from '../../types';

export class ExpressLogger implements IExpressLogger {
  private readonly logger: bunyan;
  private readonly config: LoggerConfig;
  private redact: RedactClass;
  private omitRoutes: RegExp[];

  constructor(context: LoggerContext) {
    this.redact = context.redact;
    this.logger = context.logger.child({
      origin: 'Express',
    });
    this.config = context.config;

    const routes: string[] = this.config.OMIT_ROUTES || [];
    this.omitRoutes = routes.map((route: string): RegExp => {
      return pathToRegexp(route);
    });
  }

  /**
   * ExpresJS middleware to log all success responses
   * @param req ExpressJS request object
   * @param res ExpressJS response object
   * @param next ExpressJS next function
   */
  onSuccess(req: Request, res: Response, next: NextFunction): void {
    const localLogger = this.logger;
    const localRedact = this.redact;
    const omit = this.omitRoutes.some((regexp: RegExp) => {
      return regexp.test(req.url);
    });

    if (omit) {
      next();
      return;
    }

    // eslint-disable-next-line prefer-destructuring
    const end = res.end;
    const requestId = uuid();

    req.__requestId__ = requestId;

    {
      const pickReq = ['url', 'method', 'httpVersion', 'ip', 'headers', 'body'];
      const baseData = {
        requestId,
        type: 'Request',
      };
      const __data__ = R.pipe(
        R.pick(pickReq),
        R.mergeDeepLeft(baseData),
      )(req);

      localLogger.debug(localRedact.map(__data__));
    }

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.end = function _end(chunck: any, encode: string): void {
      res.end = end;
      res.end(chunck, encode);

      const headers = res.getHeaders();
      let rawBody = String(chunck);

      const bufferContents = ['application/pdf', 'text/html'];
      const contentType = headers['content-type'] as string;

      const isBuffer = contentType && bufferContents.some(
        (h) => contentType.includes(h),
      );

      if (isBuffer) {
        rawBody = '[BUFFER]';
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let remote: any = req.ip;
      if (headers['CF-Connecting-IP']) {
        remote = headers['CF-Connecting-IP'];
      } else if (headers['True-Client-IP']) {
        remote = headers['True-Client-IP'];
      } else if (headers['X-Forwarded-For']) {
        remote = headers['X-Forwarded-For'];
      }

      let body;
      try {
        body = JSON.parse(rawBody);
      } catch (err) {
        body = rawBody;
      }

      const msg = R.ifElse(
        R.hasPath(['body', 'message']),
        R.path(['body', 'message']),
        R.prop('statusMessage'),
      )(res);

      localLogger.debug(localRedact.map({
        requestId,
        headers,
        body,
        type: 'Response',
      }), localRedact.map(msg));

      localLogger.info(localRedact.map({
        requestId,
        method: R.prop('method', req),
        path: R.prop('url', req),
        'X-Forwarded-For': remote || null,
        latency: R.prop('X-Request-Time', headers),
        statusCode: R.prop('statusCode', res),
      }), localRedact.map(msg));
    };

    next();
  }

  /**
   * ExpresJS middleware to log all success responses
   * @param error Error object
   * @param req ExpressJS request object
   * @param res ExpressJS response object
   * @param next ExpressJS next function
   */
  onError(error: Error, req: Request, res: Response, next: NextFunction): void {
    this.onSuccess.bind(this, req, res, next.bind(null, error));
  }
}
