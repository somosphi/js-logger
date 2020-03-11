import bunyan from 'bunyan';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AnySchema } from '@hapi/joi';

import { Request as ERequest, Response, NextFunction } from 'express';
import { AxiosInstance } from 'axios';
import {
  RequestAPI,
  CoreOptions,
  UriOptions,
  Request,
} from 'request';

import { LoggerConfig } from '../logger';

declare global {
  namespace jest {
    interface Matchers<R, T> {
      /**
       * Checks if the object matches the schema
       * @param schema Joi schema
       */
      toMatchSchema(schema: AnySchema): R;
    }
  }
}

declare module 'express' {
  interface Request {
    __requestId__?: string;
  }
}

export type LoggerContext = {
  logger: bunyan;
  config: LoggerConfig;
};

export interface IExpressLogger {
  onSuccess(req: ERequest, res: Response, next: NextFunction): void;
  onError(error: Error, req: ERequest, res: Response, next: NextFunction): void;
}

export interface IAxiosLogger {
  attachInterceptor(axios: AxiosInstance): void;
}

export interface IRequestLogger {
  attachDebug(requestPackage: RequestAPI<Request, CoreOptions, UriOptions>): void;
}