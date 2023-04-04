import { CAPIRequest } from "./modules/capi";
import type { History } from 'history';

export interface SDKRunnerSDKEntry {
  /**
   * SDK 名称
   */
  name: string;

  /**
   * SDK 对应 JS URL
   */
  js: string;

  /**
   * SDK 对应 CSS URL
   */
  css?: string | [string];
}

export interface SDKRunnerEnvModules {
  [moduleId: string]: any;
}

export interface SDKRunnerSetupOptions {
  /**
   * 需要使用的 SDK 列表
   */
  sdks: SDKRunnerSDKEntry[];

  /**
   * 云 API 调用实现
   */
  capi?: CAPIRequest;

  /**
   * 其他控制台模块实现
   */
  modules?: SDKRunnerEnvModules;

  /**
   * 用户信息
   */
  loginInfo?: any;

  /**
   * 需要获取地域信息
   */
  requireRegionData?: boolean;

  history?: History;
}
