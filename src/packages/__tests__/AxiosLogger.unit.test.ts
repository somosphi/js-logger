import axios from 'axios';

import * as AxiosLogger from '../AxiosLogger';

describe('Axios Log', () => {
  describe('Properties', () => {
    it('Should have the required properties', () => {
      expect(AxiosLogger).toBeDefined();
      expect(typeof AxiosLogger).toEqual('object');
      expect(AxiosLogger.attachInteceptor).toBeDefined();
      expect(typeof AxiosLogger.attachInteceptor).toEqual('function');
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

      AxiosLogger.attachInteceptor(instance);

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
