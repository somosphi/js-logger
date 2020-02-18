import bunyan from 'bunyan';

export type LoggerConfig = {
  PROJECT_NAME: string;
  LOG_LEVEL?: bunyan.LogLevel;
  OMIT_ROUTES?: string[];
};

export default function logger(config: LoggerConfig): bunyan {
  return bunyan.createLogger({
    name: config.PROJECT_NAME,
    level: config.LOG_LEVEL,
  });
}
