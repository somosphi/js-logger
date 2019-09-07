import * as R from 'ramda';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import {
  AxiosInstance, AxiosRequestConfig,
  AxiosResponse, AxiosError,
} from 'axios';

import { Logger } from '../Logger';

declare module 'axios' {
  interface AxiosRequestConfig {
    __requestId__?: string;
  }
}

const chLogger = Logger.child({
  origin: 'Axios',
});

const logRequest = R.curryN(
  1,
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const pickData: string[] = ['headers', 'method', 'url', 'data', 'params'];
    const requestId: string = uuid();

    const baseData = {
      requestId,
      type: 'Request',
      level: 'info',
    };
    const getLog = R.pipe(
      R.clone,
      R.pick(pickData),
      R.mergeDeepLeft(baseData),
      JSON.stringify,
    );

    // @ts-ignore
    const __data__ = getLog(config);
    chLogger.info(__data__);

    config.__requestId__ = requestId;
    return config;
  },
);

const logResponse = R.curryN(
  1,
  (response: AxiosResponse): AxiosResponse => {
    const picks: string[] = ['headers', 'data', 'status', 'statusText'];
    const baseData = {
      type: 'Response',
      level: 'info',
    };
    const getLog = R.pipe(
      R.pick(picks),
      R.mergeDeepLeft(baseData),
      R.assoc('requestId', R.path(['config', '__requestId__'], response)),
      JSON.stringify,
    );

    const __data__ = getLog(response);
    chLogger.info(__data__);

    return response;
  },
);

const logError = R.curryN(
  1,
  (error: AxiosError): Promise<AxiosError> => {
    const picks: string[] = ['message', 'stack'];
    const baseData = {
      type: 'Error',
      level: 'error',
    };
    const getLog = R.pipe(
      R.path(['response', 'data']),
      R.mergeDeepLeft(R.pick(picks, error)),
      R.mergeDeepLeft(baseData),
      R.assoc(
        'requestId',
        R.path(['response', 'config', '__requestId__'], error),
      ),
      JSON.stringify,
    );
    const __err__ = getLog(error);
    chLogger.error(__err__);

    return Promise.reject(error);
  },
);

/**
 * Attaches the request/response interceptor for Axios
 * @param axiosInstance Axios instance or full package
 */
export function attachInteceptor(axiosInstance: AxiosInstance): void {
  axiosInstance.interceptors.request.use(
    logRequest(), logError(),
  );
  axiosInstance.interceptors.response.use(
    logResponse(), logError(),
  );
}
