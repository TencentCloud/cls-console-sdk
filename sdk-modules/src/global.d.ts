import { Moment } from 'moment';

declare namespace seajs {
  export const require: nmc.Require;
  export const use: Function;
}

declare interface Window {
  /** e.g. cloud.tencent.com */
  QCMAIN_HOST: string;
  /** e.g. console.cloud.tencent.com */
  QCCONSOLE_HOST: string;
  /** e.g. iaas.cloud.tencent.com */
  QCBASE_HOST: string;
  /** e.g. cloudcache.tencent-cloud.cn */
  QCCDN_HOST: string;
  /** e.g. buy.cloud.tencent.com */
  QCBUY_HOST: string;

  /** seajs环境 */
  seajs: typeof seajs;
  /** moment环境 */
  moment: Moment;
  /** 描述当前环境是否基于SDK */
  TeaSDKRunner: boolean;
}
