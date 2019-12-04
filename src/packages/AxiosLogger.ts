import bunyan from 'bunyan';
import * as R from 'ramda';
import { v4 as uuid } from 'uuid';
import {
  AxiosInstance, AxiosRequestConfig,
  AxiosResponse, AxiosError,
} from 'axios';
import { IAxiosLogger, LoggerContext } from '../types';

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
    this.logger.info(__data__);

    config.__requestId__ = requestId;
    return config;
  }

  private logResponse(response: AxiosResponse): AxiosResponse {
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
    this.logger.info(__data__);

    return response;
  }

  private logError(error: AxiosError): Promise<AxiosError> {
    const picks: string[] = ['message', 'stack'];
    const baseData = {
      type: 'Error',
      level: 'error',
    };

    const __data__ = R.mergeDeepLeft(
      R.pick(picks, error),
      R.pathOr({}, ['response', 'data'], error),
    );

    const getLog = R.pipe(
      R.mergeDeepLeft(baseData),
      R.assoc(
        'requestId',
        R.path(['response', 'config', '__requestId__'], error),
      ),
      JSON.stringify,
    );
    const __err__ = getLog(__data__);
    this.logger.error(__err__);

    return Promise.reject(error);
  }
}
