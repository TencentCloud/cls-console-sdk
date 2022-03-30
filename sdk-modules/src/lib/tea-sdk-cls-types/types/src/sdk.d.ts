/// <reference types="react" />
/**
 * @fileoverview CLS SDK 入口文件
 */
import './i18n';
import './polyfill';
import '@tencent/tea-component/dist/tea-no-reset.css';
import './app.scss';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
/** 仪表盘使用chunk方式进行加载 */
import { ISdkDashboardPageControl, ISdkDashboardPageProps } from './sdk/DashboardPage/chunk';
/** 检索页使用chunk方式进行加载 */
import { ISdkSearchPageProps, ISdkSearchPageControl } from './sdk/SearchPage/chunk';
declare const SdkApi: {
  /** SDK 测通方法，可保留可不保留 */
  hello: () => string;
  /** 检索分析页 */
  SearchPage: {
    SearchPageComponent: import('react').ForwardRefExoticComponent<
      import('./sdk/SearchPage').ISdkSearchPageProps & import('react').RefAttributes<any>
    >;
  };
  /** 仪表盘页面 */
  DashboardPage: {
    DashboardPageComponent: import('react').ForwardRefExoticComponent<
      import('./sdk/DashboardPage/SdkDashboardPage').ISdkDashboardPageProps &
        import('react').RefAttributes<any>
    >;
  };
};
export default SdkApi;
declare type ISdkApi = typeof SdkApi;
export {
  ISdkApi,
  ISdkDashboardPageControl,
  ISdkDashboardPageProps,
  ISdkSearchPageControl,
  ISdkSearchPageProps,
};
