import axios from 'axios';

import logger from '../../logger';
import { AxiosLogger } from '../AxiosLogger';

describe('Axios Log', () => {
  const axiosLogger = new AxiosLogger({
    logger: logger({ PROJECT_NAME: 'axios-Test' }),
    config: { PROJECT_NAME: 'axios-test' },
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
  });
});
