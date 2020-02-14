import bunyan from 'bunyan';

import { ILoggerConfig } from './types';

export default function logger(config: ILoggerConfig): bunyan {
  return bunyan.createLogger({
    name: config.PROJECT_NAME,
    level: config.LOG_LEVEL,
  });
}
