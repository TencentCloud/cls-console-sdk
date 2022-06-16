import moment from 'moment';

import { setup } from '@tencent/tea-sdk-runner';
import { SDKRunnerSetupOptions } from '@tencent/tea-sdk-runner/lib/type';

import { getLocalStorageItem, safeJsonParse, setLocalStorageItem } from './utils/localStorageUtil';

const CLS_SDK_VERSION = 'cls-sdk-version';

export interface ClsSdkInitParams extends Omit<SDKRunnerSetupOptions, 'sdks' | 'requireRegionData' | 'loginInfo'> {
  /** 重要：需要将页面发出的请求内容，转发到腾讯云接口 */
  capi: SDKRunnerSetupOptions['capi'];
  /** @internal 使用特定的SDK版本 */
  config?: {
    js: string;
    css: string;
  };
  /** @internal 使用特定的用户身份信息，测试专用 */
  userIdentity?: {
    AppId: number;
    OwnerUin: string;
    Uin: string;
  };
}

window.moment = moment;
(window as any).QCMAIN_HOST = 'cloud.tencent.com';

export async function initSdkRunner(params: ClsSdkInitParams) {
  const {
    capi,
    config = {
      // 如果需要配置使用特定的SDK版本，可以在这里配置
      // js: 'https://imgcache.qq.com/qcloud/tea/sdk/cls.zh.a13a0c0794.js?max_age=31536000',
      // css: 'https://imgcache.qq.com/qcloud/tea/sdk/cls.zh.1f6e5e1bd7.css?max_age=31536000',
    } as any,
    userIdentity = {} as any,
  } = params;

  if (!capi) {
    return Promise.reject('init params error!');
  }

  // 加载SDK最新版本号
  if (!(config.js && config.css)) {
    const { Results } = await GetConsoleConfigVersion(capi);
    if (Results?.length) {
      config.js = Results[0]?.Url ?? '';
      config.css = Results[0]?.CSS?.[0] ?? '';
      setLocalStorageItem(CLS_SDK_VERSION, JSON.stringify(config));
    } else {
      const version = safeJsonParse(getLocalStorageItem(CLS_SDK_VERSION));
      config.js = version.js;
      config.css = version.css;
    }
  }

  // 加载用户ID信息
  if (!(userIdentity.AppId && userIdentity.OwnerUin && userIdentity.Uin)) {
    const loginInfo = await GetUserAppId(capi);
    userIdentity.AppId = loginInfo.AppId;
    userIdentity.OwnerUin = loginInfo.OwnerUin;
    userIdentity.Uin = loginInfo.Uin;
  }

  setup({
    requireRegionData: true,
    sdks: [
      {
        name: 'cls-sdk',
        js: config.js,
        css: config.css,
      },
    ],

    // 云 API 调用代理
    capi,
    loginInfo: {
      area: null,
      countryCode: '86',
      countryName: 'CN',
      identity: {},
      appId: userIdentity.AppId,
      loginUin: userIdentity.Uin,
      ownerUin: userIdentity.OwnerUin,
    },
  });
}

async function GetUserAppId(capi: SDKRunnerSetupOptions['capi']): Promise<{
  AppId: number;
  OwnerUin: string;
  Uin: string;
  RequestId: string;
}> {
  const res = await capi({
    regionId: 1,
    serviceType: 'cam',
    cmd: 'GetUserAppId',
    data: {
      Version: '2019-01-16',
    },
  });
  return res.Response;
}

async function GetConsoleConfigVersion(capi: SDKRunnerSetupOptions['capi']): Promise<{
  Total: number;
  Results: {
    Date: string;
    Site: number;
    Lang: string;
    Route: string;
    Url: string;
    Feature: string;
    Type: string;
    CSS: string;
  }[];
  RequestId: string;
}> {
  const res = await capi({
    regionId: 1,
    serviceType: 'console',
    cmd: 'DescribeConsoleConfigVersion',
    data: {
      Version: '2022-02-15',
      Limit: 20,
      Offset: 0,
      Queries: [
        {
          Route: 'cls-sdk',
          Type: 'product.sdk',
          Lang: 'zh',
          Site: 0,
        },
      ],
    },
  });
  return res.Response;
}
