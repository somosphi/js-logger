import bunyan from 'bunyan';

import { Logger } from '../Logger';
import { env } from '../env';

describe('Logger Test', () => {
  it('Should export a Bunyan instance with right name', () => {
    expect(Logger).toBeDefined();
    expect(Logger).toBeInstanceOf(bunyan);
    expect(Logger).toHaveProperty('fields.name', env.PROJECT_NAME);
  });
});
