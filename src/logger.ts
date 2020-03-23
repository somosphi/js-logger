import bunyan from 'bunyan';

import { LoggerConfig } from '../types';

export function logger(config: LoggerConfig): import('bunyan') {
  return bunyan.createLogger({
    name: config.PROJECT_NAME,
    level: config.LOG_LEVEL || 'debug',
    streams: config.STREAMS,
  });
}
