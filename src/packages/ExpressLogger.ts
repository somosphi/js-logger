import bunyan from 'bunyan';
import * as R from 'ramda';
import { v4 as uuid } from 'uuid';
import { Request, Response, NextFunction } from 'express';

import { IExpressLogger, LoggerContext, LoggerConfig } from '../types';

export class ExpressLogger implements IExpressLogger {
  private readonly logger: bunyan;
  private readonly config: LoggerConfig;

  constructor(context: LoggerContext) {
    this.logger = context.logger.child({
      origin: 'Express',
    });
    this.config = context.config;
  }

  /**
   * ExpresJS middleware to log all success responses
   * @param req ExpressJS request object
   * @param res ExpressJS response object
   * @param next ExpressJS next function
   */
  onSuccess(req: Request, res: Response, next: NextFunction): void {
    const localLogger = this.logger;
    const omitRoutes = this.config.OMIT_ROUTES || [];

    if (omitRoutes.includes(req.url)) {
      next();
      return;
    }

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
        JSON.stringify,
      )(req);

      this.logger.info(__data__);
    }

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.end = function _end(chunck: any, encode: string): void {
      res.end = end;
      res.end(chunck, encode);

      const rawBody = String(chunck);
      const headers = res.getHeaders();

      let body;
      try {
        body = JSON.parse(rawBody);
      } catch (err) {
        body = rawBody;
      }

      localLogger.info(JSON.stringify({
        requestId,
        headers,
        body,
        type: 'Response',
      }));
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
