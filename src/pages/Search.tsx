import React, { useCallback, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { decode as base64urlDecode } from 'universal-base64url';

import { SdkSearchPage } from '@tencent/cls-sdk-modules';
import { ISdkSearchPageControl, ISdkSearchPageProps } from '@tencent/tea-sdk-cls-types';

// eslint-disable-next-line @typescript-eslint/naming-convention
const __DEV__ = import.meta.env.DEV;

/** 此组件为Iframe场景设计，通过与控制台相同的路由值，完成页面初始化。不支持页面内容选择日志主题 */
export function SearchPage() {
  const searchPageControlRef = useRef<ISdkSearchPageControl>(null);

  // 初始值使用路由值。后续仅接受页面内数据修改，使用方可自行修改路由逻辑。此组件每次重渲染时，如有参数值变化，SDK内部路由将重新应用
  const [searchParams] = useSearchParams();

  /** 页面隐藏参数信息 */
  const hideParams: ISdkSearchPageProps['hideParams'] = {
    hideTopicSelect: Boolean(searchParams.get('hideTopicSelect')),
    hideHeader: Boolean(searchParams.get('hideHeader')),
    hideTopTips: Boolean(searchParams.get('hideTopTips')),
    hideConfigMenu: Boolean(searchParams.get('hideConfigMenu')),
    hideLogDownload: Boolean(searchParams.get('hideLogDownload')),
  };

  /** 传递给SDK组件的参数信息，每次变更时，SDK将执行参数内容的全量初始化 */
  const [pageParams, setPageParams] = useState({
    region: searchParams.get('region'),
    topicId: searchParams.get('topic_id'),
    logsetName: searchParams.get('logset_name'),
    topicName: searchParams.get('topic_name'),

    query: searchParams.get('query') || base64urlDecode(searchParams.get('queryBase64') || ''),
    time: (searchParams.get('time')?.split(',') as unknown as any) || null,
    filter: searchParams.get('filter'),
  } as unknown as ISdkSearchPageProps['pageParams']);

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

  return (
    <div style={{ height: "100%" }}>
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
              filter: pageParams.filter,
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

SearchPage.displayName = 'SearchConsoleSdk';
