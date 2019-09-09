import bunyan from 'bunyan';

import logger from './logger';
import AxiosLogger from './packages/AxiosLogger';
import ExpressLogger from './packages/ExpressLogger';
import {
  IExpressLogger, IAxiosLogger, LoggerContext,
  LoggerConfig,
} from '../types';

interface ILogger {
  AxiosLogger: IAxiosLogger;
  ExpressLogger: IExpressLogger;
  Logger: bunyan;
}

export default function init(config: LoggerConfig): ILogger {
  const Logger = logger(config);
  const context: LoggerContext = {
    config,
    logger: Logger,
  };

  return {
    Logger,
    AxiosLogger: new AxiosLogger(context),
    ExpressLogger: new ExpressLogger(context),
  };
}
