import { EventSourceMessage, EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
import { catchError, isObservable, Observable } from 'rxjs';

import { CAPIRequest, DEFAULTREGIONIDMAP } from '@tencent/cls-sdk-modules';
import { RequestOptions } from '@tencent/tea-sdk-runner/lib/modules/capi';

import { IApiError, IApiResponse } from './types';

const capiForwardUrl = '/clsApi';

export async function GetForwardData(url = '/') {
  const response = await fetch(capiForwardUrl + url);
  return response.json();
}

export async function postForwardData(url = '', data = {}, options?: RequestOptions) {
  const fetchUrl = capiForwardUrl + url;
  // sse
  if ((data as any)?.data?.Stream === true) {
    return new Promise((resolve) => {
      resolve(
        new Observable<EventSourceMessage>((subscriber) => {
          fetchEventSource(fetchUrl, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'same-origin', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data), // body data type must match "Content-Type" header
            async onopen(response) {
              const contentType = response.headers.get('content-type');
              if (contentType?.startsWith('application/json')) {
                // 返回json就是云api直接报错了，没有到后端
                throw await response.json();
              }
              if (!contentType?.startsWith(EventStreamContentType)) {
                throw new Error(
                  `Expected content-type to be ${EventStreamContentType}, Actual: ${contentType}, Message: ${await response.text()}`,
                );
              }
            },
            onmessage(msg) {
              subscriber.next(msg);
            },
            onclose() {
              subscriber.complete();
            },
            onerror(err) {
              throw err; // rethrow to stop the operation
            },
            openWhenHidden: true,
            fetch: self.fetch,
            signal: options?.signal,
          }).catch((e) => {
            subscriber.error(e);
          });
        }).pipe(
          catchError((error) => {
            if (error?.Response?.Error) {
              const err = error?.Response?.Error;
              throw {
                code: err.Code,
                name: err.Code,
                message: err.Message,
                data: error,
              };
            }
            throw error;
          }),
        ),
      );
    });
  }
  // json
  const response = await fetch(fetchUrl, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'same-origin', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

export async function getForwardData(url = '', data = '') {
  const response = await fetch(`${capiForwardUrl + url}${data ? `?${data}` : ''}`, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    credentials: 'same-origin',
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

/** 需要返回一个 Promise<IApiResponse> 或者在出错情况下，返回Promise.reject(IApiError) */
export const CApiForward: CAPIRequest = async function (
  body,
  options,
): Promise<IApiResponse | IApiError | Observable<EventSourceMessage>> {
  // console.log('CApiForward', body);
  try {
    const { Version, ...restData } = body.data;
    const REGIONIDMAP = window.TeaSDKRunner?.constants?.REGIONIDMAP || DEFAULTREGIONIDMAP;
    const param: {
      action: string;
      data: any;
      region: string;
      service: string;
      version: string;
    } = {
      service: body.serviceType,
      region: REGIONIDMAP[body.regionId],
      action: body.cmd,
      version: Version,
      /** 调试逻辑，用于生成一个云API错误 */
      data: (window as any).debugError ? body.data : restData,
    };

    const response = await postForwardData(
      `/forward?action=${param.action}${window.LOGIN_INFO?.loginUin ? `&uin=${window.LOGIN_INFO.loginUin}` : ''}`,
      param,
      options,
    );
    if (isObservable(response)) {
      return response as Observable<EventSourceMessage>;
    }
    if (response?.Response?.Error) {
      const err = response?.Response?.Error;
      // console.error('CApiForward Error: ', response);
      return Promise.reject({
        code: err.Code,
        name: err.Code,
        message: err.Message,
        data: response,
      });
    }

    return response;
  } catch (e) {
    console.error('CApiForward Error: ', e);
    return Promise.reject(e);
  }
};
