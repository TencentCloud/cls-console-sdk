import React from 'react';
import { DashboardPageRouteSearchParams, IDashboardAppHideParams } from './patch';
export interface ISdkDashboardPageControl {
  updatePageParams: (pageParams: Partial<ISdkDashboardPageProps['pageParams']>) => void;
  updateHideParams: (hideParams: Partial<ISdkDashboardPageProps['hideParams']>) => void;
}
export interface ISdkDashboardPageProps {
  /** 仪表盘组件控制器Ref */
  controlRef?: React.Ref<ISdkDashboardPageControl>;
  /** sdk初始化参数 */
  pageParams: Omit<DashboardPageRouteSearchParams, keyof IDashboardAppHideParams>;
  /** 页面隐藏参数 */
  hideParams?: Partial<IDashboardAppHideParams>;
  /** @deprecated */
  lazyLoadContainer?: string | Element;
}
export declare function SdkDashboardPage(props: ISdkDashboardPageProps): JSX.Element;
