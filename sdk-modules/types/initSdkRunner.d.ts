import type { History } from 'history';
import { SDKRunnerSetupOptions } from './lib/tea-sdk-runner/src/type';
declare enum Area {
    MainlandChina = 1,
    International = 2
}
export interface LoginInfo {
    appId: number;
    loginUin: string;
    ownerUin: string;
    area: Area;
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
    language?: 'zh' | 'en';
    includeGlobalCss?: boolean;
}
export declare function initSdkRunner(params: ClsSdkInitParams): Promise<never>;
export {};
