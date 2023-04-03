export type {
  ISdkApi,
  ISdkDashboardPageControl,
  ISdkDashboardPageProps,
  ISdkSearchPageControl,
  ISdkSearchPageProps,
} from '@tencent/tea-sdk-cls-types';
export * from './lib/tea-sdk-runner/src';
export type { CAPIRequest } from './lib/tea-sdk-runner/src/modules/capi';
export { constants as consoleConstants } from './lib/tea-sdk-runner/src/modules/constants';
export * from './initSdkRunner';
export * from './SdkSearchPage';
export * from './SdkDashboard';
