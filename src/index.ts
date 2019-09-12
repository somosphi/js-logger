import bunyan from 'bunyan';

import Logger from './Logger';
import { AxiosLogger } from './packages/AxiosLogger';
import { ExpressLogger } from './packages/ExpressLogger';
import { RequestLogger } from './packages/RequestLogger';
import {
  IExpressLogger, IAxiosLogger, LoggerContext,
  LoggerConfig, IRequestLogger,
} from '../types';

interface ILogger {
  AxiosLogger: IAxiosLogger;
  ExpressLogger: IExpressLogger;
  Logger: bunyan;
  RequestLogger: IRequestLogger;
}

export function init(config: LoggerConfig) {
  const logger = Logger(config);
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
