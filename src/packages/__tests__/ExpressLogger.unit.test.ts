/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable global-require */
import joi from '@hapi/joi';
import express from 'express';
import { Request } from 'jest-express/lib/request';

import logger from '../../logger';
import { ExpressLogger } from '../ExpressLogger';


describe('Express Logger', () => {
  const expressLogger = new ExpressLogger({
    logger: logger({ PROJECT_NAME: 'express-logger' }),
    config: {
      PROJECT_NAME: 'express-test',
      OMIT_ROUTES: ['/status', '/info'],
    },
  });

  describe('properties', () => {
    it('has the required properties', () => {
      expect(expressLogger).toBeDefined();
      expect(typeof expressLogger).toEqual('object');
      expect(expressLogger.onSuccess).toBeDefined();
      expect(typeof expressLogger.onSuccess).toEqual('function');
      expect(expressLogger.onError).toBeDefined();
      expect(typeof expressLogger.onError).toEqual('function');
    });
  });

  describe('usage', () => {
    it('attaches the middlewares', () => {
      const app = express();

      app.use(expressLogger.onSuccess);
      app.use(expressLogger.onError);

      const { stack } = app._router;
      expect(stack).toHaveLength(4);
      expect(stack[2]).toHaveProperty('name', 'onSuccess');
      expect(stack[3]).toHaveProperty('name', 'onError');
    });
  });

  it('logs the request and response - without latency', () => {
    const eLogger = new ExpressLogger({
      logger: logger({ PROJECT_NAME: 'express-logger', LOG_LEVEL: 'info' }),
      config: {
        PROJECT_NAME: 'express-test',
        OMIT_ROUTES: ['/status', '/info'],
      },
    });

    const infoSpy = jest.spyOn(require('bunyan').prototype, 'info');

    const req = new Request();
    const res = {
      end: jest.fn(),
      getHeaders: () => ({
        'X-Forwarded-For': ['192.168.0.1', '127.0.0.1'],
      }),
    };

    req.setBody({
      som: 'data',
    });
    req.setMethod('POST');
    // @ts-ignore
    req.url = '/v1/suupppp';

    eLogger.onSuccess(
      // @ts-ignore
      req,
      res,
      jest.fn(),
    );
    res.end();

    expect(infoSpy).toHaveBeenCalledTimes(1);
    const infoCall = infoSpy.mock.calls[0][0];
    expect(infoCall).toMatchSchema(joi.object({
      requestId: joi.string().guid({ version: 'uuidv4' }).required(),
      method: joi.string().valid('POST').required(),
      path: joi.string().valid('/v1/suupppp').required(),
      'X-Forwarded-For': joi.array()
        .items(
          joi.string()
            .valid('192.168.0.1', '127.0.0.1')
            .required(),
        ).required()
        .length(2),
    }));
  });

  it('logs the request and response - with latency', () => {
    const eLogger = new ExpressLogger({
      logger: logger({ PROJECT_NAME: 'express-logger', LOG_LEVEL: 'info' }),
      config: {
        PROJECT_NAME: 'express-test',
        OMIT_ROUTES: ['/status', '/info'],
      },
    });

    const infoSpy = jest.spyOn(require('bunyan').prototype, 'info');

    const req = new Request();
    const res = {
      end: jest.fn(),
      getHeaders: () => ({
        'X-Forwarded-For': ['192.168.0.1', '127.0.0.1'],
        'X-Request-Time': 1.2323232,
      }),
    };

    req.setBody({
      som: 'data',
    });
    req.setMethod('POST');
    // @ts-ignore
    req.url = '/v1/suupppp';

    eLogger.onSuccess(
      // @ts-ignore
      req,
      res,
      jest.fn(),
    );
    res.end();

    expect(infoSpy).toHaveBeenCalledTimes(1);
    const infoCall = infoSpy.mock.calls[0][0];
    expect(infoCall).toMatchSchema(joi.object({
      requestId: joi.string().guid({ version: 'uuidv4' }).required(),
      method: joi.string().valid('POST').required(),
      path: joi.string().valid('/v1/suupppp').required(),
      'X-Forwarded-For': joi.array()
        .items(
          joi.string()
            .valid('192.168.0.1', '127.0.0.1')
            .required(),
        ).required()
        .length(2),
      latency: joi.number().valid(1.2323232).required(),
    }));
  });

  it('logs the error', () => {
    const eLogger = new ExpressLogger({
      logger: logger({ PROJECT_NAME: 'express-logger', LOG_LEVEL: 'info' }),
      config: {
        PROJECT_NAME: 'express-test',
        OMIT_ROUTES: ['/status', '/info'],
      },
    });

    const infoSpy = jest.spyOn(require('bunyan').prototype, 'info');

    const req = new Request();
    const res = {
      end: jest.fn(),
      getHeaders: () => ({
        'X-Forwarded-For': ['192.168.0.1', '127.0.0.1'],
        'X-Request-Time': 1.2323232,
      }),
    };

    req.setBody({
      som: 'data',
    });
    req.setMethod('POST');
    // @ts-ignore
    req.url = '/v1/suupppp';

    eLogger.onError(
      new Error('some err'),
      // @ts-ignore
      req,
      res,
      jest.fn(),
    );
    res.end();

    expect(infoSpy).toHaveBeenCalledTimes(0);
  });


  it('logs the request and response (DEBUG LEVEL)', () => {
    const eLogger = new ExpressLogger({
      logger: logger({ PROJECT_NAME: 'express-logger' }),
      config: {
        PROJECT_NAME: 'express-test',
        OMIT_ROUTES: ['/status', '/info'],
      },
    });

    const infoSpy = jest.spyOn(require('bunyan').prototype, 'info');
    const debugSpy = jest.spyOn(require('bunyan').prototype, 'debug');

    const req = new Request();
    const res = {
      end: jest.fn(),
      getHeaders: () => ({
        'X-Forwarded-For': ['192.168.0.1', '127.0.0.1'],
      }),
    };

    req.setBody({
      som: 'data',
    });
    req.setMethod('POST');
    // @ts-ignore
    req.url = '/v1/suupppp';

    eLogger.onSuccess(
      // @ts-ignore
      req,
      res,
      jest.fn(),
    );
    res.end();

    expect(infoSpy).toHaveBeenCalledTimes(1);
    const infoCall = infoSpy.mock.calls[0][0];
    expect(infoCall).toMatchSchema(joi.object({
      requestId: joi.string().guid({ version: 'uuidv4' }).required(),
      method: joi.string().valid('POST').required(),
      path: joi.string().valid('/v1/suupppp').required(),
      'X-Forwarded-For': joi.array()
        .items(
          joi.string()
            .valid('192.168.0.1', '127.0.0.1')
            .required(),
        ).required()
        .length(2),
    }));

    expect(debugSpy).toHaveBeenCalledTimes(2);
  });
});
