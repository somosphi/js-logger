import bunyan from 'bunyan';

import Logger from '../Logger';

describe('Logger Test', () => {
  const logger = Logger({ PROJECT_NAME: 'loggerTest' });

  it('Should export a Bunyan instance with right name', () => {
    expect(logger).toBeDefined();
    expect(logger).toBeInstanceOf(bunyan);
    expect(logger).toHaveProperty('fields.name', 'loggerTest');
  });
});
