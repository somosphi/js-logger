import * as R from 'ramda';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { Request, Response, NextFunction } from 'express';

import { env } from '../env';
import { Logger } from '../Logger';

const chLogger = Logger.child({
  origin: 'ExpressJS',
});

/**
 * ExpresJS middleware to log all success responses
 * @param req ExpressJS request object
 * @param res ExpressJS response object
 * @param next ExpressJS next function
 */
export function onSuccess(req: Request, res: Response, next: NextFunction): void {
  const omitRoutes = env.OMIT_ROUTES;

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
      timestamp: moment().utc().format(),
      type: 'Request',
      level: 'info',
    };
    const __data__ = R.pipe(
      R.pick(pickReq),
      R.mergeDeepLeft(baseData),
    )(req);
    chLogger.info(__data__);
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
    chLogger.info({
      requestId,
      headers,
      body,
      timestamp: moment().utc().format(),
      type: 'Response',
      level: 'info',
    });
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
export function onError(error: Error, req: Request, res: Response, next: NextFunction): void {
  onSuccess(req, res, next.bind(null, error));
}
