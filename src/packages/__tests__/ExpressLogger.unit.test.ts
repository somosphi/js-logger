import logger from '../../logger';
import ExpressLogger from '../ExpressLogger';

describe('Express Logger', () => {
  const expressLogger = new ExpressLogger({
    logger: logger({ PROJECT_NAME: 'express-logger' }),
    config: {
      OMIT_ROUTES: ['/status', '/info'],
    },
  });

  it('Should have the required properties', () => {
    expect(expressLogger).toBeDefined();
    expect(typeof expressLogger).toEqual('object');
    expect(expressLogger.onSuccess).toBeDefined();
    expect(typeof expressLogger.onSuccess).toEqual('function');
    expect(expressLogger.onError).toBeDefined();
    expect(typeof expressLogger.onError).toEqual('function');
  });
});
