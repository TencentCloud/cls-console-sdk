import React from 'react';
import { DuckCmpProps } from 'saga-duck';
import { ISearchFilter, TimeRange } from './patch';
import Duck, { ISdkSearchPageHideParams } from '../../../sdkTypes';

export interface ISdkSearchPageControl {
  updatePageParams: (pageParams: Partial<ISdkSearchPageProps['pageParams']>) => void;
  updateHideParams: (hideParams: Partial<ISdkSearchPageProps['hideParams']>) => void;
}
export interface ISdkSearchPageProps {
  controlRef?: React.Ref<ISdkSearchPageControl>;
  /** sdk初始化参数 */
  pageParams: {
    region: string;
    topicId?: string;
    logsetName?: string;
    topicName?: string;

    query?: string;
    /** 给定时间选项、时间选项ID、时间范围、ISO8601-TimeRange字符串，设置时间值 */
    time?: TimeRange | [string, string];
    /** 过滤器值，需自行保障匹配索引配置能力。通过base64Url处理后的控制台Filter参数，参考控制台检索页分享按钮 */
    filter?: string;
    /** @deprecated 后续无需传递 */
    logsetId?: string;
  };
  /** 页面隐藏参数 */
  hideParams?: ISdkSearchPageHideParams;
  /** 当页面参数变更时通知SDK调用者，调用方可自行将页面参数同步到路由 */
  onPageParamsUpdate?: (param: ISdkSearchPageProps['pageParams']) => void;
}
export declare const SdkSearchPage: React.MemoExoticComponent<
  (props: DuckCmpProps<Duck> & ISdkSearchPageProps) => JSX.Element
>;
