import React from 'react';

import { TimeRange, ISearchAppHideParams } from '../../../patch';
export interface ISdkSearchPageControl {
  updatePageParams: (pageParams: Partial<ISdkSearchPageProps['pageParams']>) => void;
  updateHideParams: (hideParams: Partial<ISdkSearchPageProps['hideParams']>) => void;
}
export interface ISdkSearchPageProps {
  controlRef?: React.Ref<ISdkSearchPageControl>;
  /** sdk初始化参数，当值发生变更时，将会进行全量更新 */
  pageParams: {
    region: string;
    topicId?: string;
    topicName?: string;
    logsetName?: string;
    query?: string;
    /** 给定时间选项、时间选项ID、时间范围、ISO8601-TimeRange字符串，设置时间值 */
    time?: TimeRange | [string, string];
    /** 过滤器值，需自行保障匹配索引配置能力。
     * 建议SDK调用者不要对此字段进行处理，此字段文档见 https://iwiki.woa.com/pages/viewpage.action?pageId=1393785933 */
    filter?: string;
    /** @deprecated 后续无需传递 */
    logsetId?: string;
  };
  /** 页面隐藏参数 */
  hideParams?: Partial<ISearchAppHideParams>;
  /** 当页面参数变更时通知SDK调用者，调用方可自行将页面参数同步到路由。
   * Sdk组件不是`纯受控组件` 不推荐直接用于修改 pageParams，应当仅在需要外部注入新数据时，修改 pageParams */
  onPageParamsUpdate?: (param: ISdkSearchPageProps['pageParams']) => void;
}
export declare const SdkSearchPage: React.MemoExoticComponent<(props: ISdkSearchPageProps) => JSX.Element>;
