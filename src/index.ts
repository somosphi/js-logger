import bunyan from 'bunyan';

import Logger from './Logger';
import AxiosLogger from './packages/AxiosLogger';
import ExpressLogger from './packages/ExpressLogger';
import RequestLogger from './packages/RequestLogger';
import {
  IExpressLogger, IAxiosLogger, LoggerContext,
  LoggerConfig,
  IRequestLogger,
} from '../types';

interface ILogger {
  AxiosLogger: IAxiosLogger;
  ExpressLogger: IExpressLogger;
  Logger: bunyan;
  RequestLogger: IRequestLogger;
}

export default function init(config: LoggerConfig): ILogger {
  const logger = Logger(config);
  const context: LoggerContext = {
    config,
    logger,
  };

  return {
    Logger: logger,
    AxiosLogger: new AxiosLogger(context),
    ExpressLogger: new ExpressLogger(context),
    RequestLogger: new RequestLogger(context),
  };
}
