import React from 'react';

export interface ISdkAgentObservePageControl {
  updatePageParams: (pageParams: Partial<ISdkAgentObservePageProps['pageParams']>) => void;
  updateHideParams: (hideParams: Partial<ISdkAgentObservePageProps['hideParams']>) => void;
}

export interface IAgentObservePageParams {
  [key: string]: any;
  /** 应用 ID */
  applicationId?: string;
  /** 地域展示名 */
  region?: string;
  /** 应用名 */
  applicationName?: string;
  /** 接入类型 */
  accessType?: string;
  /** Trace 主题 ID */
  topicId?: string;
  /** 顶层 Tab（dashboard/alarm/trace/session） */
  tab?: string;
  /** 仪表盘子 Tab */
  dashboardSubTab?: string;
  /** 时间区间起点 */
  timeFrom?: string;
  /** 时间区间终点 */
  timeTo?: string;
}

export interface IAgentObserveHideParams {
  [key: string]: any;
}

export interface ISdkAgentObservePageProps {
  /** 页面控制器 Ref */
  controlRef?: React.Ref<ISdkAgentObservePageControl>;
  /** SDK 初始化参数 */
  pageParams: IAgentObservePageParams;
  /** 页面隐藏参数 */
  hideParams?: Partial<IAgentObserveHideParams>;
  /** 当页面参数变更时通知外界 */
  onPageParamsUpdate?: (pageParams: Partial<IAgentObservePageParams>) => void;
  /** 外部路由 history，传入后 SDK 内部 Router 将使用此 history 同步 URL */
  history?: import('history').History;
}
