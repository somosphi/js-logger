/* eslint-disable global-require */
import joi from '@hapi/joi';
import nock from 'nock';

import axios from 'axios';

import logger from '../../logger';
import { AxiosLogger } from '../AxiosLogger';
import Redact from '../Redact';

describe('Axios Log', () => {
  const axiosLogger = new AxiosLogger({
    logger: logger({ PROJECT_NAME: 'axios-Test' }),
    redact: new Redact(),
    config: {
      PROJECT_NAME: 'axios-test',
    },
  });

  describe('Properties', () => {
    it('Should have the required properties', () => {
      expect(axiosLogger).toBeDefined();
      expect(typeof axiosLogger).toEqual('object');
      expect(axiosLogger.attachInterceptor).toBeDefined();
      expect(typeof axiosLogger.attachInterceptor).toEqual('function');
    });
  });

  describe('Usage', () => {
    it('Should attach a interceptor', () => {
      const instance = axios.create({
        baseURL: 'http://example.com',
      });

      expect(instance).toBeDefined();
      expect(instance).toHaveProperty('interceptors.request');
      expect(instance.interceptors.request).toBeDefined();
      expect(JSON.stringify(instance.interceptors.request)).toEqual(JSON.stringify({
        handlers: [],
      }));
      expect(instance).toHaveProperty('interceptors.response');
      expect(instance.interceptors.response).toBeDefined();
      expect(JSON.stringify(instance.interceptors.response)).toEqual(JSON.stringify({
        handlers: [],
      }));

      axiosLogger.attachInterceptor(instance);

      expect(instance).toHaveProperty('interceptors.request');
      expect(instance.interceptors.request).toBeDefined();
      expect(JSON.stringify(instance.interceptors.request)).toEqual(JSON.stringify({
        handlers: [{}],
      }));
      expect(instance).toHaveProperty('interceptors.response');
      expect(instance.interceptors.response).toBeDefined();
      expect(JSON.stringify(instance.interceptors.response)).toEqual(JSON.stringify({
        handlers: [{}],
      }));
    });

    it('logs with the message as an empty string', async () => {
      const spy = jest.spyOn(require('bunyan').prototype, 'debug');

      nock('http://localhost:3000')
        .post('/test')
        .reply(200, { some: 'data' });

      const instance = axios.create({
        baseURL: 'http://localhost:3000',
      });
      axiosLogger.attachInterceptor(instance);

      const body = {
        data: 'some',
      };
      await instance.post('http://localhost:3000/test', body);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(2);

      const fstCall = spy.mock.calls[0][0];
      expect(fstCall).toMatchSchema(joi.object({
        type: joi.string().valid('Request').required(),
        headers: joi.object().required(),
        method: joi.string().valid('post').required(),
        data: joi.object().valid(body).required(),
        url: joi.string().valid('http://localhost:3000/test').required(),
        requestId: joi.string().guid({ version: 'uuidv4' }).required(),
      }));

      const sndCall = spy.mock.calls[1][0];
      expect(sndCall).toMatchSchema(joi.object({
        type: joi.string().valid('Response').required(),
        headers: joi.object().required(),
        status: joi.number().valid(200).required(),
        data: joi.object().valid({ some: 'data' }).required(),
        requestId: joi.string().guid({ version: 'uuidv4' }).required(),
      }));
    });

    it('logs the error response', async () => {
      const debugSpy = jest.spyOn(require('bunyan').prototype, 'debug');
      const errSpy = jest.spyOn(require('bunyan').prototype, 'error');

      nock('http://localhost:3000')
        .post('/test')
        .reply(500, { some: 'data' });

      const instance = axios.create({
        baseURL: 'http://localhost:3000',
      });
      axiosLogger.attachInterceptor(instance);

      const body = {
        data: 'some',
      };
      await instance.post('http://localhost:3000/test', body)
        .catch((err) => expect(err).toBeDefined());

      expect(debugSpy).toHaveBeenCalled();
      expect(debugSpy).toHaveBeenCalledTimes(1);

      const fstCall = debugSpy.mock.calls[0][0];
      expect(fstCall).toMatchSchema(joi.object({
        type: joi.string().valid('Request').required(),
        headers: joi.object().required(),
        method: joi.string().valid('post').required(),
        data: joi.object().valid(body).required(),
        url: joi.string().valid('http://localhost:3000/test').required(),
        requestId: joi.string().guid({ version: 'uuidv4' }).required(),
      }));

      const errFstCall = errSpy.mock.calls[0][0];
      expect(errFstCall).toMatchSchema(joi.object({
        type: joi.string().valid('Error').required(),
        stack: joi.string().required(),
        data: joi.object().valid({ some: 'data' }).required(),
        requestId: joi.string().guid({ version: 'uuidv4' }).required(),
      }));
      const errSndCall = errSpy.mock.calls[0][1];
      expect(errSndCall).toBe('Request failed with status code 500');
    });
  });
});
