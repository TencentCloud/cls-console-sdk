import React, { forwardRef } from 'react';
import ReactDOM from 'react-dom';

import { ISdkApi, ISdkAgentObservePageControl, ISdkAgentObservePageProps } from '@tencent/tea-sdk-cls-types';

import { SDKLoader } from './lib/tea-sdk-runner/src';

export type ISdkAgentObserveControl = ISdkAgentObservePageControl;
export type ISdkAgentObserveProps = ISdkAgentObservePageProps;

export const SdkAgentObserveRoutes = forwardRef((params: ISdkAgentObservePageProps, ref) => {
  if (!(window as any).TeaSDKRunner) {
    return <div>sdk未初始化</div>;
  }
  return (
    <SDKLoader sdkNames={['cls-sdk']}>
      {(sdks) => {
        const clsSdk: ISdkApi = sdks[0];
        const { AgentObservePageRoutes } = clsSdk.AgentObservePage;
        return <AgentObservePageRoutes ref={ref} {...params} />;
      }}
    </SDKLoader>
  );
});

SdkAgentObserveRoutes.displayName = 'SdkAgentObserveRoutes';

/** 非React技术栈方案 */
export function renderSdkAgentObserveRoutes(
  props: Omit<ISdkAgentObservePageProps, 'controlRef'>,
  container: Element | DocumentFragment,
) {
  /** 由于此render函数为外部调用，每次调用都重新渲染，因此此处可以使用const常量替代useRef
   *  若使用useRef，则外部必须要为函数组件，导致sdk调用对外部产生依赖。使用const常量可以规避
   */
  const controlRef: React.Ref<ISdkAgentObservePageControl> = { current: null };
  try {
    const sdkAgentObserveRoutes = <SdkAgentObserveRoutes controlRef={controlRef} {...props} />;
    ReactDOM.render(sdkAgentObserveRoutes, container);
  } catch (e) {
    console.error(e);
  }
  return {
    controlRef,
    destroy: () => ReactDOM.unmountComponentAtNode(container),
  };
}

export const SdkAgentObserveDetailPage = forwardRef((params: ISdkAgentObservePageProps, ref) => {
  if (!(window as any).TeaSDKRunner) {
    return <div>sdk未初始化</div>;
  }
  return (
    <SDKLoader sdkNames={['cls-sdk']}>
      {(sdks) => {
        const clsSdk: ISdkApi = sdks[0];
        const { AgentObserveDetailPageComponent } = clsSdk.AgentObservePage;
        return <AgentObserveDetailPageComponent ref={ref} {...params} />;
      }}
    </SDKLoader>
  );
});

SdkAgentObserveDetailPage.displayName = 'SdkAgentObserveDetailPage';

/** 非React技术栈方案 */
export function renderSdkAgentObserveDetailPage(
  props: Omit<ISdkAgentObservePageProps, 'controlRef'>,
  container: Element | DocumentFragment,
) {
  /** 由于此render函数为外部调用，每次调用都重新渲染，因此此处可以使用const常量替代useRef
   *  若使用useRef，则外部必须要为函数组件，导致sdk调用对外部产生依赖。使用const常量可以规避
   */
  const controlRef: React.Ref<ISdkAgentObservePageControl> = { current: null };
  try {
    const sdkAgentObserveDetailPage = <SdkAgentObserveDetailPage controlRef={controlRef} {...props} />;
    ReactDOM.render(sdkAgentObserveDetailPage, container);
  } catch (e) {
    console.error(e);
  }
  return {
    controlRef,
    destroy: () => ReactDOM.unmountComponentAtNode(container),
  };
}
