import bunyan from 'bunyan';
// eslint-disable-next-line import/no-unresolved
import { Request as ERequest, Response, NextFunction } from 'express';
import { AxiosInstance } from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  RequestAPI,
  CoreOptions,
  UriOptions,
  Request,
} from 'request';

declare function init(config: LoggerConfig): {
  Logger: bunyan;
  AxiosLogger: IAxiosLogger;
  ExpressLogger: IExpressLogger;
  RequestLogger: IRequestLogger;
};

declare module 'express' {
  // tslint:disable-next-line: interface-name
  interface Request {
    __requestId__?: string;
  }
}

export interface LoggerConfig {
  PROJECT_NAME: string;
  LOG_LEVEL?: bunyan.LogLevel;
  OMIT_ROUTES?: string[];
}

export interface LoggerContext {
  logger: bunyan;
  config: LoggerConfig;
}

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
