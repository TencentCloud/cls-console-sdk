export type {
  ISdkApi,
  ISdkDashboardPageControl,
  ISdkDashboardPageProps,
  ISdkSearchPageControl,
  ISdkSearchPageProps,
} from '@tencent/tea-sdk-cls-types';
export * from './lib/tea-sdk-runner/src';
export type { CAPIRequest, RequestOptions } from './lib/tea-sdk-runner/src/modules/capi';
export * from './initSdkRunner';
export * from './SdkSearchPage';
export * from './SdkDashboard';
