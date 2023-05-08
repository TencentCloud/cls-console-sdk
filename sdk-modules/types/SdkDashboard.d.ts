import React from 'react';
import { ISdkDashboardPageProps } from '@tencent/tea-sdk-cls-types';
export declare const SdkDashboard: React.ForwardRefExoticComponent<import("./lib/tea-sdk-cls-types/types/src/sdk/DashboardPage/SdkDashboardPage").ISdkDashboardPageProps & React.RefAttributes<unknown>>;
/** 非React技术栈方案 */
export declare function renderSdkDashboard(props: Omit<ISdkDashboardPageProps, 'controlRef'>, container: Element | DocumentFragment): {
    controlRef: React.RefObject<import("./lib/tea-sdk-cls-types/types/src/sdk/DashboardPage/SdkDashboardPage").ISdkDashboardPageControl>;
    destroy: () => void;
};
