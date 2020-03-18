/* eslint-disable @typescript-eslint/ban-ts-ignore */
import bunyan from 'bunyan';
import * as R from 'ramda';
import { v4 as uuid } from 'uuid';
import {
  AxiosInstance, AxiosRequestConfig,
  AxiosResponse, AxiosError,
} from 'axios';

import { IAxiosLogger, LoggerContext } from '../../types';

declare module 'axios' {
  // tslint:disable-next-line: interface-name
  interface AxiosRequestConfig {
    __requestId__?: string;
  }
}

export class AxiosLogger implements IAxiosLogger {
  private logger: bunyan;

  constructor(context: LoggerContext) {
    this.logger = context.logger.child({
      origin: 'Axios',
    });
  }

  /**
   * Attaches the request/response interceptor for Axios
   * @param axiosInstance Axios instance
   */
  attachInterceptor(axiosInstance: AxiosInstance): void {
    axiosInstance.interceptors.request.use(
      this.logRequest.bind(this), this.logError.bind(this),
    );
    axiosInstance.interceptors.response.use(
      this.logResponse.bind(this), this.logError.bind(this),
    );
  }

  private logRequest(config: AxiosRequestConfig): AxiosRequestConfig {
    const pickData: string[] = ['headers', 'method', 'url', 'data', 'params'];
    const requestId: string = uuid();

    const baseData = {
      requestId,
      type: 'Request',
    };
    const getLog = R.pipe(
      R.clone,
      R.pick(pickData),
      R.mergeDeepLeft(baseData),
    );

    // @ts-ignore
    const __data__ = getLog(config);
    this.logger.debug(__data__);

    // eslint-disable-next-line no-param-reassign
    config.__requestId__ = requestId;
    return config;
  }

  private logResponse(response: AxiosResponse): AxiosResponse {
    const picks: string[] = ['headers', 'data', 'status', 'statusText'];
    const baseData = {
      type: 'Response',
    };
    const getLog = R.pipe(
      R.pick(picks),
      R.mergeDeepLeft(baseData),
      R.assoc('requestId', R.path(['config', '__requestId__'], response)),
    );

    const __data__ = getLog(response);
    this.logger.debug(__data__);

    return response;
  }

  private logError(error: AxiosError): Promise<AxiosError> {
    const logData = {
      type: 'Error',
      stack: R.prop('stack', error),
      data: R.path(['response', 'data'], error),
      requestId: R.path(['response', 'config', '__requestId__'], error),
    };
    const msg = R.prop('message', error);

    this.logger.error(logData, msg);

    return Promise.reject(error);
  }
}
