import { initSdkRunner } from '@tencent/cls-sdk-modules';

import { CApiForward, getForwardData, postForwardData } from './utils/capi';
import { IApiResponse } from './utils/types';

// 登录 验证密码
export const verifyPassword = async (pwd: string, forceUpdate: () => void, language?: 'zh' | 'en') => {
  try {
    await Login(pwd);
    if (!(window as any).TeaSDKRunner) {
      initSdkRunner({ capi: CApiForward, language }).then(() => forceUpdate());
    }
  } catch (e: any) {
    if (e?.code === 401) {
      alert('密码错误，刷新后重新填写！');
    }
  }
};

// 验证是否已登录
export const verifyLogin = (forceUpdate: () => void, language?: 'zh' | 'en') =>
  isLog()
    .then((res) => {
      if (res) {
        if (!(window as any).TeaSDKRunner) {
          initSdkRunner({ capi: CApiForward, language }).then(() => forceUpdate());
        }
        return { isLoggedIn: true };
      }
      return { isLoggedIn: false };
    })
    .catch((err) => {
      console.error(err);
      return { isLoggedIn: false };
    });

async function Login(pwd): Promise<IApiResponse> {
  try {
    const response = await postForwardData('/user/login', { pwd });
    if (response?.code) {
      console.error('LoginForward Error: ', response);
      return Promise.reject(response);
    }

    // console.log('CApiForward Response: ', response);
    return response.data;
  } catch (e) {
    console.error('CApiForward Error: ', e);
    return Promise.reject(e);
  }
}

const isLog = async () => {
  const response = await getForwardData('/user/isLog');
  return response.data !== 'failed';
};
