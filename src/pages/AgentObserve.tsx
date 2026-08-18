import { History } from 'history';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  ISdkAgentObservePageControl,
  ISdkAgentObservePageProps,
  SdkAgentObserveDetailPage,
} from '@tencent/cls-sdk-modules';

import { renderUrl } from '../utils/url';

export function AgentObservePage({ history }: { history: History }) {
  const agentObservePageControlRef = useRef<ISdkAgentObservePageControl | null>(null as any);

  // 初始值使用路由值。后续仅接受页面内数据修改，使用方可自行修改路由逻辑。此组件每次重渲染时，如有参数值变化，SDK内部路由将重新应用
  const searchParams = new URLSearchParams(history.location.search);

  const { pageParams: initPageParams, hideParams: initHideParams } = categorizeSearchParams(searchParams);

  /** 页面隐藏参数信息 */
  const hideParamsRef = useRef(initHideParams);
  const hideParams: ISdkAgentObservePageProps['hideParams'] = initHideParams;

  /** 传递给SDK组件的参数信息，每次变更时，SDK将执行参数内容的全量初始化 */
  const [pageParams, setPageParams] = useState(initPageParams as unknown as ISdkAgentObservePageProps['pageParams']);

  /** 存储SDK内部的实时状态 */
  const [innerPageParams, setInnerPageParams] = useState<Partial<ISdkAgentObservePageProps['pageParams']>>(pageParams);

  /** 外部的行为逻辑入口，如需要在外部触发切换应用时进行调用 */
  const triggerPageParamsChange = useCallback(
    (params: Partial<ISdkAgentObservePageProps['pageParams']>) => {
      setPageParams({
        ...innerPageParams,
        ...params,
        applicationId: params.applicationId || '',
      });
    },
    [innerPageParams, setPageParams],
  );
  // triggerPageParamsChange({applicationId:''})
  (window as any).triggerPageParamsChange = triggerPageParamsChange;

  // 可选：同步SDK内部状态到URL，支持刷新后自动选中之前状态
  useEffect(() => {
    const updatedUrl = renderUrl(history.location.pathname, {
      ...hideParamsRef.current,
      ...innerPageParams,
      time: innerPageParams.time,
    });
    history.replace(updatedUrl, history.location.state);
  }, [history, innerPageParams]);

  // useEffect(() => {
  //  console.log('pageParams:', innerPageParams);
  // }, [innerPageParams]);

  return (
    <div style={{ height: '100%' }}>
      <SdkAgentObserveDetailPage
        controlRef={agentObservePageControlRef}
        hideParams={hideParams}
        /** pageParams 发生变更时，将会进行全量更新! */
        pageParams={pageParams}
        /** Sdk组件并非是纯受控组件，直接在回调中实时修改 pageParams 可能会导致时序问题 */
        onPageParamsUpdate={setInnerPageParams}
      />
    </div>
  );
}

function categorizeSearchParams(searchParams: URLSearchParams) {
  const hideParams: ISdkAgentObservePageProps['hideParams'] = {};
  const pageParams: ISdkAgentObservePageProps['pageParams'] = {};

  Array.from(searchParams.keys()).forEach((key) => {
    if (key.startsWith('hide')) {
      hideParams[key] = searchParams.get(key);
    } else {
      const paramValue = searchParams.getAll(key);
      pageParams[key] = paramValue?.length === 1 ? paramValue[0] : paramValue;
    }
  });

  return {
    pageParams,
    hideParams,
  };
}
