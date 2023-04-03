import type { History } from 'history';

import moment from './lib/moment';
import { setup } from './lib/tea-sdk-runner/src';
import { SDKRunnerSetupOptions } from './lib/tea-sdk-runner/src/type';
import { getLocalStorageItem, safeJsonParse, setLocalStorageItem } from './utils/localStorageUtil';

window.moment = moment;
moment.locale('zh-cn');

const CLS_SDK_VERSION = 'cls-sdk-version';

export interface LoginInfo {
  appId: number;
  loginUin: string;
  ownerUin: string;
  area: 1 | 2; // 1国内站 2国际站，同时决定语言
  countryCode?: '86';
  countryName?: 'CN';
  identity?: any;
}

export interface ClsSdkInitParams extends Omit<SDKRunnerSetupOptions, 'sdks' | 'requireRegionData' | 'loginInfo'> {
  /** 重要：需要将页面发出的请求内容，转发到腾讯云接口 */
  capi: SDKRunnerSetupOptions['capi'];
  /** @internal 使用特定的SDK版本 */
  config?: {
    js: string;
    css: string;
  };
  /** @internal 使用特定的用户身份信息，测试专用 */
  loginInfo?: Partial<LoginInfo>;

  history?: History;
}

export async function initSdkRunner(params: ClsSdkInitParams) {
  const {
    capi,
    config = {
      // 如果需要配置使用特定的SDK版本，可以在这里配置
      // js: 'https://imgcache.qq.com/qcloud/tea/sdk/cls.zh.a13a0c0794.js?max_age=31536000',
      // css: 'https://imgcache.qq.com/qcloud/tea/sdk/cls.zh.1f6e5e1bd7.css?max_age=31536000',
    } as any,
    loginInfo = {},
    history,
  } = params;

  if (!capi) {
    return Promise.reject('init params error!');
  }

  // 加载用户ID信息
  if (!(loginInfo?.appId && loginInfo?.ownerUin && loginInfo?.loginUin)) {
    const userIdInfo = await GetUserAppId(capi);
    loginInfo.appId = userIdInfo.AppId;
    loginInfo.ownerUin = userIdInfo.OwnerUin;
    loginInfo.loginUin = userIdInfo.Uin;
  }

  // 加载SDK最新版本号
  const configVersionResult = await GetConsoleConfigVersion(capi, loginInfo.area === 2);
  const sdkConfigs: { [key: string]: { js: string; css: string } } = {};
  configVersionResult.forEach((config) => {
    const sdkName = config.Route;
    if (sdkConfigs[sdkName]) {
      return;
    }
    const sdkConfig = configVersionResult
      .filter((item) => item.Route === sdkName && item.Site <= 1)
      .sort((a, b) => a.Site - b.Site)
      .pop(); // 优先取 Site === 1 中国站单独配置，否则取 Site === 0 不分站点配置

    sdkConfigs[sdkName] = {
      js: sdkConfig.Url,
      css: sdkConfig.CSS,
    };
  });

  if (!(config.js && config.css)) {
    if (sdkConfigs['cls-sdk']?.js) {
      config.js = sdkConfigs['cls-sdk'].js;
      config.css = sdkConfigs['cls-sdk'].css;
      setLocalStorageItem(CLS_SDK_VERSION, JSON.stringify(config));
    } else {
      const version = safeJsonParse(getLocalStorageItem(CLS_SDK_VERSION));
      config.js = version.js;
      config.css = version.css;
    }
  }

  // 设置Moment语言版本
  moment.locale(loginInfo.area === 2 ? 'en' : 'zh-cn');

  initQcHost(loginInfo);

  setup({
    requireRegionData: true,
    sdks: [
      ...Object.keys(sdkConfigs).map((sdkName) => ({
        name: sdkName,
        js: sdkConfigs[sdkName].js,
        css: sdkConfigs[sdkName].css,
      })),
      {
        name: 'cls-sdk',
        js: config.js,
        css: config.css,
      },
    ],

    // 云 API 调用代理
    capi,
    loginInfo: {
      countryCode: '86',
      countryName: 'CN',
      identity: {},
      ...loginInfo,
    },
    history,
  });
}

// 设置全局Host变量
function initQcHost(loginInfo: ClsSdkInitParams['loginInfo']) {
  const isInternational = Number(loginInfo?.area) === 2;
  const QCLOUD_ROOT_HOST = !isInternational ? 'cloud.tencent.com' : 'tencentcloud.com';
  (window as any).QCLOUD_ROOT_HOST = QCLOUD_ROOT_HOST;
  (window as any).QCMAIN_HOST = !isInternational ? 'cloud.tencent.com' : 'www.tencentcloud.com';
  (window as any).QCCDN_HOST = 'cloudcache.tencent-cloud.com';
  (window as any).QCCONSOLE_HOST = `console.${QCLOUD_ROOT_HOST}`;
  (window as any).QCBASE_HOST = `iaas.${QCLOUD_ROOT_HOST}`;
  (window as any).QCBUY_HOST = `buy.${QCLOUD_ROOT_HOST}`;
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

async function GetConsoleConfigVersion(
  capi: SDKRunnerSetupOptions['capi'],
  isI18n?: boolean,
): Promise<
  {
    Date: string;
    Site: number;
    Lang: string;
    Route: string;
    Url: string;
    Feature: string;
    Type: string;
    CSS: string;
  }[]
> {
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Response: { Results },
  }: {
    Response: {
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
    };
  } = await capi({
    regionId: 1,
    serviceType: 'console',
    cmd: 'DescribeConsoleConfigVersion',
    data: {
      Version: '2022-02-15',
      Limit: 100,
      Offset: 0,
      Queries: [
        {
          Route: 'cls-sdk',
          Type: 'product.sdk',
          // Site: 1,
          Lang: 'zh',
        },
        {
          Route: 'tag-sdk',
          Type: 'product.sdk',
          // Site: 1,
          Lang: 'zh',
        },
        {
          Route: 'cam-sdk',
          Type: 'product.sdk',
          // Site: 1,
          Lang: 'zh',
        },
        {
          Route: 'menus-sdk',
          Type: 'product.sdk',
          // Site: 1,
          Lang: 'zh',
        },
        {
          Route: 'nps-service-sdk',
          Type: 'product.sdk',
          // Site: 1,
          Lang: 'zh',
        },
        {
          Route: 'help-sdk',
          Type: 'product.sdk',
          // Site: 1,
          Lang: 'zh',
        },
        {
          Route: 'monitor-v2-sdk',
          Type: 'product.sdk',
          // Site: 1,
          Lang: 'zh',
        },
      ],
    },
  });
  return Results.filter((item) => (!isI18n ? item.Lang === 'zh' : item.Lang !== 'zh'));
}
