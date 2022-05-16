import { CAPIRequest } from '../../sdk-modules/src';
import { constants as consoleConstants } from '../../sdk-modules/src/lib/tea-sdk-runner/src/modules/constants';
import { IApiResponse, IApiError } from './types';

// 开发模式前后端分离，部署时直接使用nest进行部署
const capiForwardUrl = import.meta.env.DEV ? 'http://127.0.0.1:3001' : '';

export async function GetForwardData(url = '/') {
  const response = await fetch(capiForwardUrl + url);
  return response.json();
}

export async function postForwardData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(capiForwardUrl + url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'include', // include, *same-origin, omit
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
    credentials: 'include',
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

/** 需要返回一个 Promise<IApiResponse> 或者在出错情况下，返回Promise.reject(IApiError) */
export const CApiForward: CAPIRequest = async function (body): Promise<IApiResponse | IApiError> {
  // console.log('CApiForward', body);
  try {
    const { Version, ...restData } = body.data;
    const param: {
      action: string;
      data: any;
      region: string;
      service: string;
      version: string;
    } = {
      service: body.serviceType,
      region: consoleConstants.REGIONIDMAP[body.regionId],
      action: body.cmd,
      version: Version,
      /** 调试逻辑，用于生成一个云API错误 */
      data: (window as any).debugError ? body.data : restData,
    };

    const response = await postForwardData('/forward', param);
    if (response?.Response?.Error) {
      const err = response?.Response?.Error;
      // console.log('CApiForward Error: ', response);
      return Promise.reject({
        code: err.Code,
        name: err.Code,
        message: err.Message,
        data: response,
      });
    }

    return response;
  } catch (e) {
    console.log('CApiForward Error: ', e);
    return Promise.reject(e);
  }
};
