import bunyan from 'bunyan';
import { Request, Response, NextFunction } from 'express';
import { AxiosStatic, AxiosInstance } from 'axios';

/**
 * @property {string='logger'} PROJECT_NAME
 * @property {string[]=['/status', '/info']} OMIT_ROUTES
 */
export interface Environment {
  PROJECT_NAME: string;
  OMIT_ROUTES: string[];
}

declare module 'express' {
  interface Request {
    __requestId__?: string;
  }
}

export interface LoggerConfig {
  PROJECT_NAME?: string;
  OMIT_ROUTES?: string[];
}

export interface LoggerContext {
  logger: bunyan;
  config: LoggerConfig;
}

export interface IExpressLogger {
  onSuccess(req: Request, res: Response, next: NextFunction): void;
  onError(error: Error, req: Request, res: Response, next: NextFunction): void;
}

export interface IAxiosLogger {
  attachInterceptor(axios: AxiosInstance): void;
}
