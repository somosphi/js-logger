import bunyan from 'bunyan';

import { env } from './env';

export const Logger: bunyan = bunyan.createLogger({
  name: env.PROJECT_NAME,
});
