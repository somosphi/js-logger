import * as BLogger from './logger';
import { AxiosLogger } from './packages/AxiosLogger';
import { ExpressLogger } from './packages/ExpressLogger';
import { RequestLogger } from './packages/RequestLogger';
import { LoggerConfig, LoggerContext } from '../types';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function init(config: LoggerConfig) {
  const logger = BLogger.default(config);
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
