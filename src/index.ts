import bunyan from 'bunyan';
import * as BLogger from './Logger';
import { AxiosLogger } from './packages/AxiosLogger';
import { ExpressLogger } from './packages/ExpressLogger';
import { RequestLogger } from './packages/RequestLogger';
import {
  LoggerContext,
  LoggerConfig,
} from '../types';

export function init(config: LoggerConfig) {
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
