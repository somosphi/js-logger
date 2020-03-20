/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable global-require */
import joi from '@hapi/joi';
import { Request } from 'jest-express/lib/request';

import { logger } from '../../logger';
import { ExpressLogger } from '../ExpressLogger';
import Redact from '../Redact';


describe('Express Logger', () => {
  const expressLogger = new ExpressLogger({
    logger: logger({ PROJECT_NAME: 'express-logger' }),
    redact: new Redact(),
    config: {
      PROJECT_NAME: 'express-test',
      OMIT_ROUTES: ['/status', '/info'],
    },
  });

  describe('properties', () => {
    it('has the required properties', () => {
      expect(expressLogger).toBeInstanceOf(Object);
      expect(expressLogger.onSuccess).toBeInstanceOf(Function);
      expect(expressLogger.onError).toBeInstanceOf(Function);
    });
  });

  describe('usage', () => {
    it('logs the request and response - without latency', () => {
      const eLogger = new ExpressLogger({
        logger: logger({ PROJECT_NAME: 'express-logger', LOG_LEVEL: 'info' }),
        redact: new Redact(),
        config: {
          PROJECT_NAME: 'express-test',
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
        redact: new Redact(),
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
        redact: new Redact(),
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
        redact: new Redact(),
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

    it('doesnt log if it has the OMIT_ROUTES config', () => {
      const eLogger = new ExpressLogger({
        logger: logger({ PROJECT_NAME: 'express-logger', LOG_LEVEL: 'info' }),
        redact: new Redact(),
        config: {
          PROJECT_NAME: 'express-test',
          OMIT_ROUTES: [
            '/status',
            '/info',
          ],
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

      // @ts-ignore
      req.url = '/status';

      eLogger.onSuccess(
        // @ts-ignore
        req,
        res,
        jest.fn(),
      );
      res.end();

      expect(infoSpy).toHaveBeenCalledTimes(0);
    });

    it('doesnt log if it has the OMIT_ROUTES config with parameters', () => {
      const eLogger = new ExpressLogger({
        logger: logger({ PROJECT_NAME: 'express-logger', LOG_LEVEL: 'info' }),
        redact: new Redact(),
        config: {
          PROJECT_NAME: 'express-test',
          OMIT_ROUTES: [
            '/status',
            '/info',
            '/users/:id/profile',
          ],
        },
      });

      const infoSpy = jest.spyOn(require('bunyan').prototype, 'info');

      const req = new Request();
      const res = {
        end: jest.fn(),
      };

      // @ts-ignore
      req.url = '/users/1234/profile';

      eLogger.onSuccess(
        // @ts-ignore
        req,
        res,
        jest.fn(),
      );
      res.end();

      expect(infoSpy).toHaveBeenCalledTimes(0);
    });
  });
});
