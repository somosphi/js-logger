import nock from 'nock';
import request from 'request';
import sinon from 'sinon';

import logger from '../../logger';
import { RequestLogger } from '../RequestLogger';
import { ILoggerConfig } from '../../types';
import { promisify } from 'util';

describe('Express Logger', () => {
  const config: ILoggerConfig = {
    PROJECT_NAME: 'request-logger',
    OMIT_ROUTES: ['/status', '/info'],
  };

  it('has all required properties', () => {
    const reqLogger = new RequestLogger({
      logger: logger(config),
      config,
    });

    expect(reqLogger).toBeDefined();
    expect(typeof reqLogger).toEqual('object');
    expect(reqLogger.attachDebug).toBeDefined();
    expect(typeof reqLogger.attachDebug).toBe('function');
  });

  it('can log with the right format', async () => {
    const reqLogger = new RequestLogger({
      logger: logger(config),
      config,
    });

    const spy = sinon.spy();
    sinon.stub(reqLogger, 'log' as any).callsFake(spy);

    reqLogger.attachDebug(request);

    const reqConfig = {
      uri: 'https://example.com',
      body: { t: 123 },
    };

    nock(reqConfig.uri)
      .post('/')
      .reply(200, { success: true });

    const reqFunc = promisify(request);

    await reqFunc({
      uri: reqConfig.uri,
      method: 'POST',
      json: reqConfig.body,
    });

    const [[req], [res]] = spy.args;
    expect(req).toBeDefined();
    expect(req).toHaveProperty('requestId');
    expect(req).toMatchObject({
      type: 'Request',
      uri: `${reqConfig.uri}/`,
      method: 'POST',
      body: reqConfig.body,
    });
    const reqId = req.requestId;

    expect(res).toBeDefined();
    expect(res).toHaveProperty('requestId', reqId);
    expect(res).toMatchObject({
      type: 'Response',
      statusCode: 200,
      body: { success: true },
    });
  });
});
