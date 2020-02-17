import bunyan from 'bunyan';
import * as BLogger from './logger';
import { AxiosLogger } from './packages/AxiosLogger';
import { ExpressLogger } from './packages/ExpressLogger';
import { RequestLogger } from './packages/RequestLogger';
import { LoggerConfig, LoggerContext } from './types';

type InitReturn = {
  Logger: bunyan;
  AxiosLogger: AxiosLogger;
  ExpressLogger: ExpressLogger;
  RequestLogger: RequestLogger;
};

export function init(config: LoggerConfig): InitReturn {
  const logger: bunyan = BLogger.default(config);
  const context: LoggerContext = {
    config,
    logger,
  };

  const axios = new AxiosLogger(context);
  const express = new ExpressLogger(context);
  const request = new RequestLogger(context);

  return {
    Logger: logger,
    AxiosLogger: axios,
    ExpressLogger: express,
    RequestLogger: request,
  };
}
