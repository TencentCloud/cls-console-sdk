import React from 'react';
import { ISdkSearchPageProps } from '@tencent/tea-sdk-cls-types';
export declare const SdkSearchPage: React.ForwardRefExoticComponent<Omit<any, "ref"> & React.RefAttributes<unknown>>;
/** 非React技术栈方案 */
export declare function renderSdkSearchPage(props: Omit<ISdkSearchPageProps, 'controlRef'>, container: Element | DocumentFragment): {
    controlRef: React.RefObject<any>;
    destroy: () => void;
};
