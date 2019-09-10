import bunyan from 'bunyan';
import { Request as ERequest, Response, NextFunction } from 'express';
import { AxiosStatic, AxiosInstance } from 'axios';
import { RequestAPI, CoreOptions, UriOptions, Request } from 'request';

declare module 'express' {
  interface Request {
    __requestId__?: string;
  }
}

export interface LoggerConfig {
  PROJECT_NAME: string;
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
