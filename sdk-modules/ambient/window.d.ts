
declare interface Window {
  seajs: typeof seajs;
  regionConfig: {
    regionList: any[],
    intlRegionList: any[],
    ftCloudRegionList: any[],
    autoDrivingCloudRegions: any[],
  };
  // console环境window
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
  /** e.g. cloud.tencent.com */
  QCLOUD_ROOT_HOST: string;
  /**
   * cls sdk独立部署要跳转的 host
   * e.g. clsiframe.com
   * */
  CLS_DEPLOYMENT_HOST: string;
}
