import React, { forwardRef } from 'react';
import ReactDOM from 'react-dom';

import { ISdkApi, ISdkSearchPageControl, ISdkSearchPageProps } from '@tencent/tea-sdk-cls-types';
import { SDKLoader } from '@tencent/tea-sdk-runner';

export const SdkSearchPage = forwardRef((params: ISdkSearchPageProps) => {
  if (!(window as any).TeaSDKRunner) {
    return <div>sdk未初始化</div>;
  }
  return (
    <SDKLoader sdkNames={['cls-sdk']}>
      {(sdks) => {
        const clsSdk: ISdkApi = sdks[0];
        const { SearchPageComponent } = clsSdk.SearchPage;
        return <SearchPageComponent {...params} />;
      }}
    </SDKLoader>
  );
});

SdkSearchPage.displayName = 'SdkSearchPage';

/** 非React技术栈方案 */
export function renderSdkSearchPage(
  props: Omit<ISdkSearchPageProps, 'controlRef'>,
  container: Element | DocumentFragment,
) {
  /** 由于此render函数为外部调用，每次调用都重新渲染，因此此处可以使用const常量替代useRef
   *  若使用useRef，则外部必须要为函数组件，导致sdk调用对外部产生依赖。使用const常量可以规避
   */
  const controlRef: React.Ref<ISdkSearchPageControl> = { current: null };
  try {
    const sdkSearchPage = <SdkSearchPage controlRef={controlRef} {...props} />;
    ReactDOM.render(sdkSearchPage, container);
  } catch (e) {
    console.error(e);
  }
  return {
    controlRef,
    destroy: () => ReactDOM.unmountComponentAtNode(container),
  };
}
