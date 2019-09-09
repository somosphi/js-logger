import bunyan from 'bunyan';

import { LoggerConfig } from '../types';

export default function logger(config: LoggerConfig): bunyan {
  return bunyan.createLogger({
    name: config.PROJECT_NAME,
  });
}
