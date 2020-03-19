import bunyan from 'bunyan';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  AnySchema,
} from '@hapi/joi';

import { Request as ERequest, Response, NextFunction } from 'express';
import { AxiosInstance } from 'axios';
import {
  RequestAPI,
  CoreOptions,
  UriOptions,
  Request,
} from 'request';

import { LoggerConfig } from '../src/logger';

declare global {
  // eslint-disable-next-line no-redeclare
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
  redact: RedactClass;
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

export interface RedactClass {
  key(str: string): boolean;
  value(str: string): boolean;
  map(obj: unknown): unknown;
  addKey(key: RegExp): void;
  addValue(value: RegExp): void;
}
