import { logger as Logger, LoggerConfig } from './logger';
import { AxiosLogger } from './packages/AxiosLogger';
import { ExpressLogger } from './packages/ExpressLogger';
import { RequestLogger } from './packages/RequestLogger';
import Redact from './packages/Redact';
import { LoggerContext } from '../types';

export const init = (config: LoggerConfig) => {
  const redact = new Redact(config.REDACTED);
  const logger = Logger(config);
  const context: LoggerContext = {
    config,
    logger,
    redact,
  };

  const axios = new AxiosLogger(context);
  const express = new ExpressLogger(context);
  const request = new RequestLogger(context);

  return {
    Logger: logger,
    AxiosLogger: axios,
    ExpressLogger: express,
    RequestLogger: request,
    Redact: redact,
  };
};
