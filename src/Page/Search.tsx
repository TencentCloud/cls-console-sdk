import React, { useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { decode as base64urlDecode } from 'universal-base64url';

import { SdkSearchPage } from '@tencent/cls-sdk-modules';
import { ISdkSearchPageControl, ISdkSearchPageProps } from '@tencent/tea-sdk-cls-types';

/** 此组件为Iframe场景设计，通过与控制台相同的路由值，完成页面初始化。不支持页面内容选择日志主题 */
export function SearchPage() {
  const searchPageControlRef = useRef<ISdkSearchPageControl>(null);

  // 初始值使用路由值。后续仅接受页面内数据修改，使用方可自行修改路由逻辑
  const [searchParams] = useSearchParams();

  const pageParams: ISdkSearchPageProps['pageParams'] = {
    region: searchParams.get('region'),
    topicId: searchParams.get('topic_id'),
    logsetName: searchParams.get('logset_name'),
    topicName: searchParams.get('topic_name'),

    query: searchParams.get('query') || base64urlDecode(searchParams.get('queryBase64') || ''),
    time: (searchParams.get('time')?.split(',') as unknown as any) || null,
    filter: searchParams.get('filter'),
  } as any;

  const hideParams: ISdkSearchPageProps['hideParams'] = {
    hideTopicSelect: Boolean(searchParams.get('hideTopicSelect')),
    hideHeader: Boolean(searchParams.get('hideHeader')),
    hideTopTips: Boolean(searchParams.get('hideTopTips')),
    hideConfigMenu: Boolean(searchParams.get('hideConfigMenu')),
    hideLogDownload: Boolean(searchParams.get('hideLogDownload')),
  };

  const onPageParamsUpdate = useCallback((params: ISdkSearchPageProps['pageParams']) => {
    // 当前组件设计为iframe方案，不进行路由同步。对于需要定制开发的用户，可自行处理 onPageParamsUpdate 逻辑
    console.log('sdk params change: ', JSON.stringify(params));
  }, []);

  return (
    <div>
      {import.meta.env.DEV && (
        <div style={{ padding: 20, borderBottom: '1px solid black' }}>
          调试逻辑，完成调试后删除本段代码
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
        pageParams={pageParams}
        onPageParamsUpdate={onPageParamsUpdate}
      />
    </div>
  );
}
