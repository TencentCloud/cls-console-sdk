import type { History } from 'history';
import { flatten } from 'lodash-es';

import moment from './lib/moment';
import { setup } from './lib/tea-sdk-runner/src';
import { RegionConstants, SDKRunnerSetupOptions } from './lib/tea-sdk-runner/src/type';
import { getLocalStorageItem, safeJsonParse, setLocalStorageItem } from './utils/localStorageUtil';

window.moment = moment;
moment.locale('zh-cn');
window.regionConfig = {
  regionList: [],
  intlRegionList: [],
  ftCloudRegionList: [
    {
      id: 11,
      region: 'ap-shenzhen-fsi',
      regionName: '华南地区（深圳金融）',
      regionNameEn: 'South China (Shenzhen Finance)',
      regionPrefix: 'szjr',
      zoneList: [
        {
          zoneId: 110001,
          zoneName: '深圳金融一区',
          zoneCode: 'ap-shenzhen-fsi-1',
        },
        {
          zoneId: 110003,
          zoneName: '深圳金融三区',
          zoneCode: 'ap-shenzhen-fsi-3',
        },
      ],
    },
    {
      id: 7,
      region: 'ap-shanghai-fsi',
      regionName: '华东地区（上海金融）',
      regionNameEn: 'East China (Shanghai Finance)',
      regionPrefix: 'shjr',
      zoneList: [
        {
          zoneId: 700002,
          zoneName: '上海金融二区',
          zoneCode: 'ap-shanghai-fsi-2',
        },
      ],
    },
  ],
  autoDrivingCloudRegions: [
    {
      id: 78,
      region: 'ap-shanghai-adc',
      regionName: '华东地区（上海自动驾驶云）',
      regionNameEn: 'East China (ap-shanghai-adc)',
      regionPrefix: 'shadc',
      zoneList: [
        {
          zoneId: 780001,
          zoneName: '上海自动驾驶云一区',
          zoneCode: 'ap-shanghai-adc-1',
        },
      ],
    },
  ],
};
window.ftCloudRegions = window.regionConfig.ftCloudRegionList;
window.autoDrivingCloudRegions = window.regionConfig.autoDrivingCloudRegions;

const CLS_SDK_VERSION = 'cls-sdk-version';

enum Area {
  MainlandChina = 1,
  International = 2,
}
enum PlatformSite {
  Default = 0,
  MainlandChina = 1,
  International = 2,
}

export interface LoginInfo {
  appId: number;
  loginUin: string;
  ownerUin: string;
  area: Area; // 1国内站 2国际站
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

  // zh, en
  language?: 'zh' | 'en';

  // 是否引用默认全局CSS，默认true。如为false，则需要在页面中手动引用css，以免部分页面显示异常。
  includeGlobalCss?: boolean;
}

export async function initSdkRunner(params: ClsSdkInitParams) {
  const {
    capi,
    config = {
      // 如果需要配置使用特定的SDK版本，可以在这里配置
      // js: 'https://cloudcache.tencent-cloud.com/qcloud/tea/sdk/cls.zh.8afc73b631.js',
      // css: 'https://cloudcache.tencent-cloud.com/qcloud/tea/sdk/cls.zh.642db74dc1.css',
      // menusJs: 'https://cloudcache.tencent-cloud.com/qcloud/tea/sdk/menus.zh.90a77ee835.js?max_age=31536000',
      // menusCss: 'https://cloudcache.tencent-cloud.com/qcloud/tea/sdk/menus.zh.8971819ebe.css?max_age=31536000',
    } as any,
    loginInfo = {},
    history,
    includeGlobalCss = true,
  } = params;

  if (!capi) {
    return Promise.reject('init params error!');
  }

  const promises: Promise<any>[] = [];

  // 加载SDK最新版本号
  promises.push(getConsoleConfigVersion(capi));
  // 加载地域常量
  promises.push(initRegionConstants(capi));
  // 加载用户ID信息
  const needInitLoginInfo = !(loginInfo?.appId && loginInfo?.ownerUin && loginInfo?.loginUin && loginInfo?.area);
  if (needInitLoginInfo) {
    promises.push(DescribeCurrentUserDetails(capi));
  }
  // 并发发起请求
  const [configVersionResult, regionConstants, userIdInfo] = await Promise.all(promises);

  if (needInitLoginInfo) {
    loginInfo.appId = Number(userIdInfo.AppId?.[0]);
    loginInfo.ownerUin = String(userIdInfo.OwnerUin);
    loginInfo.loginUin = String(userIdInfo.Uin);
    loginInfo.area = Number(userIdInfo.Area) > 0 ? Area.International : Area.MainlandChina;
  }

  const isI18n = loginInfo.area === Area.International;
  const language = params.language || (isI18n ? 'en' : 'zh');

  const sdkConfigs: { [key: string]: { js: string; css: string } } = {};
  const platformLanguage = language === 'en' ? 'any' : language;
  configVersionResult.forEach((config) => {
    const sdkName = config.Route;
    if (sdkConfigs[sdkName]) {
      return;
    }
    const sdkConfig = configVersionResult
      .filter((item) => {
        if (item.Route !== 'global-css-sdk' && item.Lang !== platformLanguage) {
          return false;
        }
        if (item.Route === sdkName) {
          return (
            item.Site === PlatformSite.Default ||
            item.Site === (isI18n ? PlatformSite.International : PlatformSite.MainlandChina)
          );
        }
        return false;
      })
      .sort((a, b) => a.Site - b.Site)
      .pop(); // 优先取 Site === 1 中国站 / Site === 2 国际站 单独配置，否则取 Site === 0 不分站点配置

    if (sdkConfig?.Url) {
      sdkConfigs[sdkName] = {
        js: sdkConfig.Url,
        css: sdkConfig.CSS,
      };
    }
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

  if (config.menusJs && config.menusCss) {
    sdkConfigs['menus-sdk'].js = config.menusJs;
    sdkConfigs['menus-sdk'].css = config.menusCss;
  }

  // 设置Moment语言版本
  moment.locale(language === 'zh' ? 'zh-cn' : language);

  initQcHost(loginInfo);

  setup({
    requireRegionData: true,
    sdks: [
      ...Object.keys(sdkConfigs)
        .filter((sdkName) => sdkName !== 'cls-sdk')
        .map((sdkName) => ({
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
    language,
    includeGlobalCss,
    regionConstants,
  });
}

// 设置全局Host变量
function initQcHost(loginInfo: ClsSdkInitParams['loginInfo']) {
  const isI18n = Number(loginInfo?.area) === Area.International;
  const QCLOUD_ROOT_HOST = !isI18n ? 'cloud.tencent.com' : 'tencentcloud.com';
  (window as any).QCLOUD_ROOT_HOST = QCLOUD_ROOT_HOST;
  (window as any).QCMAIN_HOST = !isI18n ? 'cloud.tencent.com' : 'www.tencentcloud.com';
  (window as any).QCCDN_HOST = 'cloudcache.tencent-cloud.com';
  (window as any).QCCDN_BACKUP_HOST = 'cloudcache.tencentcs.com';
  (window as any).QCCONSOLE_HOST = `console.${QCLOUD_ROOT_HOST}`;
  (window as any).QCBASE_HOST = `iaas.${QCLOUD_ROOT_HOST}`;
  (window as any).QCBUY_HOST = `buy.${QCLOUD_ROOT_HOST}`;
}

async function DescribeCurrentUserDetails(capi: SDKRunnerSetupOptions['capi']): Promise<{
  AppId: number[];
  OwnerUin: number;
  Uin: number;
  Area: string;
  RequestId: string;
}> {
  const res = await capi({
    regionId: 1,
    serviceType: 'account',
    cmd: 'DescribeCurrentUserDetails',
    data: {
      Version: '2018-12-25',
    },
  });
  return res.Response;
}

async function getConsoleConfigVersion(capi: SDKRunnerSetupOptions['capi']): Promise<
  {
    Date: string;
    Site: PlatformSite;
    Lang: string;
    Route: string;
    Url: string;
    Feature: string;
    Type: string;
    CSS: string;
  }[]
> {
  const rainbowGroup = 'cls_console_sdk_console_queries';
  const rainbowMap = await capi({
    regionId: 1,
    serviceType: 'cls',
    cmd: 'DescribeRainbowConfigs',
    data: { Version: '2020-10-16', Groups: [rainbowGroup], Product: 'cls', Type: 'table' },
  }).then(({ Response: result }) =>
    Object.fromEntries(result.RainbowTables.map((item) => [item.Group, item.Rows.map((row) => safeJsonParse(row))])),
  );

  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Response: { Results },
  }: {
    Response: {
      Total: number;
      Results: {
        Date: string;
        Site: PlatformSite;
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
      Limit: 1000,
      Offset: 0,
      Queries: rainbowMap[rainbowGroup].map((item) => ({
        Route: item.Route,
        Type: item.Type,
        Site: item.Site ? Number(item.Site) : undefined,
        Lang: item.Lang ? Number(item.Lang) : undefined,
      })),
    },
  });
  return Results;
}

async function initRegionConstants(capi: SDKRunnerSetupOptions['capi']): Promise<RegionConstants> {
  try {
    const { Response: response } = await capi({
      regionId: 1,
      serviceType: 'region',
      cmd: 'DescribeRegionsAndZones',
      data: { Version: '2022-06-27' },
    });
    const resourceRegionSet = response.ResourceRegionSet || [];
    const result: RegionConstants = {
      REGIONIDMAP: Object.fromEntries(resourceRegionSet.map((region) => [region.RegionId, region.Region])),
      REGIONMAP: Object.fromEntries(resourceRegionSet.map((region) => [region.RegionId, region.RegionShortName])),
      REGIONNAMES: Object.fromEntries(resourceRegionSet.map((region) => [region.RegionId, region.RegionName])),
      REGIONORDER: resourceRegionSet.sort((a, b) => b.Weight - a.Weight).map((item) => item.RegionId),
      REGIONAREAMAP: Object.fromEntries(
        resourceRegionSet.map((region) => [region.Region, { area: region.Location, name: region.RegionName }]),
      ),
      ZONEIDMAP: Object.fromEntries(
        flatten(resourceRegionSet.map((region) => region.ResourceZoneSet.map((zone) => [zone.ZoneId, zone.Zone]))),
      ),
    };
    return result;
  } catch (error) {
    // 如果报错就算了，用本地兜底配置
    return null;
  }
}
