import bunyan from 'bunyan';

import logger from '../logger';

describe('Logger Test', () => {
  const log = logger({ PROJECT_NAME: 'loggerTest' });

  it('Should export a Bunyan instance with right name', () => {
    expect(log).toBeDefined();
    expect(log).toBeInstanceOf(bunyan);
    expect(log).toHaveProperty('fields.name', 'loggerTest');
  });
});
