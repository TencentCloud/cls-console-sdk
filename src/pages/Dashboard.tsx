import { History } from 'history';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { ISdkDashboardPageControl, ISdkDashboardPageProps, SdkDashboard } from '@tencent/cls-sdk-modules';

import { renderUrl } from '../utils/url';

export function DashboardPage({ history }: { history: History }) {
  const dashboardPageControlRef = useRef<ISdkDashboardPageControl | null>(null as any);

  // 初始值使用路由值。后续仅接受页面内数据修改，使用方可自行修改路由逻辑。此组件每次重渲染时，如有参数值变化，SDK内部路由将重新应用
  const searchParams = new URLSearchParams(history.location.search);

  const { pageParams: initPageParams, hideParams: initHideParams } = categorizeSearchParams(searchParams);

  /** 页面隐藏参数信息 */
  const hideParamsRef = useRef(initHideParams);
  const hideParams: ISdkDashboardPageProps['hideParams'] = initHideParams;

  /** 传递给SDK组件的参数信息，每次变更时，SDK将执行参数内容的全量初始化 */
  const [pageParams, setPageParams] = useState(initPageParams as unknown as ISdkDashboardPageProps['pageParams']);

  /** 存储SDK内部的实时状态 */
  const [innerPageParams, setInnerPageParams] = useState<Partial<ISdkDashboardPageProps['pageParams']>>(pageParams);

  /** 外部的行为逻辑入口，如需要在外部触发切换日志主题时进行调用 */
  const triggerPageParamsChange = useCallback(
    (params: Partial<ISdkDashboardPageProps['pageParams']>) => {
      setPageParams({
        ...innerPageParams,
        ...params,
        id: params.id || '',
      });
    },
    [innerPageParams, setPageParams],
  );
  // triggerPageParamsChange({topicId:''})
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

  useEffect(() => {
    console.log('pageParams:', innerPageParams);
  }, [innerPageParams]);

  return (
    <div style={{ height: '100%' }}>
      <SdkDashboard
        controlRef={dashboardPageControlRef}
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
  const hideParams: ISdkDashboardPageProps['hideParams'] = {};
  const pageParams: ISdkDashboardPageProps['pageParams'] = { id: null };

  Array.from(searchParams.keys()).forEach((key) => {
    if (key.startsWith('hide')) {
      hideParams[key] = searchParams.get(key);
    } else {
      const paramValue = searchParams.getAll(key);
      pageParams[key] = paramValue?.length ? paramValue : paramValue[0];
    }
  });

  return {
    pageParams,
    hideParams,
  };
}
