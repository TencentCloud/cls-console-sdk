import React from 'react';
import { ISdkAgentObservePageControl, ISdkAgentObservePageProps } from '@tencent/tea-sdk-cls-types';
export type ISdkAgentObserveControl = ISdkAgentObservePageControl;
export type ISdkAgentObserveProps = ISdkAgentObservePageProps;
export declare const SdkAgentObserveRoutes: React.ForwardRefExoticComponent<ISdkAgentObservePageProps & React.RefAttributes<unknown>>;
/** 非React技术栈方案 */
export declare function renderSdkAgentObserveRoutes(props: Omit<ISdkAgentObservePageProps, 'controlRef'>, container: Element | DocumentFragment): {
    controlRef: React.RefObject<ISdkAgentObservePageControl>;
    destroy: () => boolean;
};
export declare const SdkAgentObserveDetailPage: React.ForwardRefExoticComponent<ISdkAgentObservePageProps & React.RefAttributes<unknown>>;
/** 非React技术栈方案 */
export declare function renderSdkAgentObserveDetailPage(props: Omit<ISdkAgentObservePageProps, 'controlRef'>, container: Element | DocumentFragment): {
    controlRef: React.RefObject<ISdkAgentObservePageControl>;
    destroy: () => boolean;
};
