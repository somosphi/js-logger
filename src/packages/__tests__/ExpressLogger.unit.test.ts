import * as ExpressLogger from '../ExpressLogger';

describe('Express Logger', () => {
  it('Should have the required properties', () => {
    expect(ExpressLogger).toBeDefined();
    expect(typeof ExpressLogger).toEqual('object');
    expect(ExpressLogger.onSuccess).toBeDefined();
    expect(typeof ExpressLogger.onSuccess).toEqual('function');
    expect(ExpressLogger.onError).toBeDefined();
    expect(typeof ExpressLogger.onError).toEqual('function');
  });
});
