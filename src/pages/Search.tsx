import { History } from 'history';
import React, { useCallback, useRef, useState, useEffect } from 'react';

import { SdkSearchPage } from '@tencent/cls-sdk-modules';
import { ISdkSearchPageControl, ISdkSearchPageProps } from '@tencent/tea-sdk-cls-types';

import { getTimeOptionId, renderUrl } from '../utils/url';

// eslint-disable-next-line @typescript-eslint/naming-convention
const __DEV__ = import.meta.env.DEV;

/** 此组件为Iframe场景设计，通过与控制台相同的路由值，完成页面初始化。不支持页面内容选择日志主题 */
export function SearchPage({ history }: { history: History }) {
  const searchPageControlRef = useRef<ISdkSearchPageControl>(null);

  // 初始值使用路由值。后续仅接受页面内数据修改，使用方可自行修改路由逻辑。此组件每次重渲染时，如有参数值变化，SDK内部路由将重新应用
  const searchParams = new URLSearchParams(history.location.search);

  const { pageParams: initPageParams, hideParams: initHideParams } = categorizeSearchParams(searchParams);

  /** 页面隐藏参数信息 */
  const hideParamsRef = useRef(initHideParams);
  const hideParams: ISdkSearchPageProps['hideParams'] = initHideParams;

  /** 传递给SDK组件的参数信息，每次变更时，SDK将执行参数内容的全量初始化 */
  const [pageParams, setPageParams] = useState(initPageParams as unknown as ISdkSearchPageProps['pageParams']);

  /** 存储SDK内部的实时状态 */
  const [innerPageParams, setInnerPageParams] = useState(pageParams);

  /** 外部的行为逻辑入口，如需要在外部触发切换日志主题时进行调用 */
  const triggerPageParamsChange = useCallback(
    (params: Partial<ISdkSearchPageProps['pageParams']>) => {
      setPageParams({
        ...innerPageParams,
        ...params,
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
      time: getTimeOptionId(innerPageParams.time),
    });
    history.replace(updatedUrl, history.location.state);
  }, [history, innerPageParams]);

  useEffect(() => {
    console.log('pageParams:', innerPageParams);
  }, [innerPageParams]);

  return (
    <div style={{ height: '100%' }}>
      {__DEV__ && (
        <div style={{ padding: 20, borderBottom: '1px solid black' }}>
          调试逻辑，完成调试后删除本段代码
          <br />
          pageParams 是当前传递给组件的参数，并非页面内的实时内容
          <p>
            {JSON.stringify({
              region: pageParams.region,
              topic_id: pageParams.topicId,
              logset_name: pageParams.logsetName,
              topic_name: pageParams.topicName,
              query: pageParams.query,
              time: pageParams.time,
            })}
          </p>
          <p>{JSON.stringify(hideParams)}</p>
        </div>
      )}
      <SdkSearchPage
        controlRef={searchPageControlRef}
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
  const hideParams: ISdkSearchPageProps['hideParams'] = {};
  const pageParams: ISdkSearchPageProps['pageParams'] = { region: null };
  searchParams.forEach((value, key) => {
    if (key.startsWith('hide')) {
      hideParams[key] = value;
      return;
    }
    switch (key) {
      case 'topic_id':
        pageParams.topicId = value;
        break;
      case 'logset_name':
        pageParams.logsetName = value;
        break;
      case 'topic_name':
        pageParams.topicName = value;
        break;

      case 'time':
        pageParams.time = (searchParams.get('time')?.split(',') as unknown as any) || null;
        break;

      default:
        pageParams[key] = value;
        break;
    }
  });
  return {
    pageParams,
    hideParams,
  };
}

SearchPage.displayName = 'SearchConsoleSdk';
