import { Moment } from 'moment';

/** 将 src 中使用到的 app 文件夹的类型内容，统一放到此处 */
export declare type TimeRange = [Moment, Moment];

export declare const enum LocationParseType {
  any = "any",
  string = "string",
  number = "number",
  boolean = "boolean",
  'string[]' = "string[]",
  'number[]' = "number[]",
  'boolean[]' = "boolean[]"
}

export declare type IDashboardAppHideParams = Record<keyof typeof DashboardAppHideParamKeyMap, boolean>;
export declare const DashboardAppHideParamKeyMap: {
  hideWidget: {
    type: LocationParseType;
  };
  hideTopNav: {
    type: LocationParseType;
  };
  hideLeftNav: {
    type: LocationParseType;
  };
  hideHeader: {
    type: LocationParseType;
  };
  hideChartModifyOperation: {
    type: LocationParseType;
  };
  hideChartGridDrag: {
    type: LocationParseType;
  };
  hideChartGridResize: {
    type: LocationParseType;
  };
  hideTimeSelector: {
    type: LocationParseType;
  };
  hideRefreshSelector: {
    type: LocationParseType;
  };
  hideChartFullScreenOperation: {
    type: LocationParseType;
  };
  hideChartExportOperation: {
    type: LocationParseType;
  };
  hideChartAddToAlarmOperation: {
    type: LocationParseType;
  };
};

export interface DashboardPageRouteSearchParams extends IDashboardAppHideParams {
  id: string;
  /**
   * 预设仪表盘类型，格式为 `${云产品简称}-${场景名称}`，如 `tke-audit-overview`
   * 提供了此参数后，ID不再工作，直接查询模板仪表盘，结合路由参数进行渲染
   */
  templateId?: string;
  editPanel?: string;
  viewPanel?: string;
  editView?: string;
  time?: string;
}

export declare type ISearchAppHideParams = Record<keyof typeof SearchAppHideParamKeyMap, boolean>;
/**
 * hide系列参数，支持url参数控制隐藏部分内容，主要支持内嵌控制台自定义展示需求
 * hideWidget hideTopNav hideLeftNav 参数为平台提供的隐藏参数，隐藏 智能客服button、顶部导航、左侧导航
 * cls相应隐藏参数需要注意，不与平台相应参数冲突
 *
 * hideHeader: 隐藏cls顶部Header，包括title和地域选择
 * hideTopTips: 隐藏顶部Alert提示
 * hideTopicSelect: 隐藏日志主题下拉框
 */
export declare const SearchAppHideParamKeyMap: {
  hideWidget: {
    type: LocationParseType;
  };
  hideTopNav: {
    type: LocationParseType;
  };
  hideLeftNav: {
    type: LocationParseType;
  };
  hideHeader: {
    type: LocationParseType;
  };
  hideTopTips: {
    type: LocationParseType;
  };
  hideTopicSelect: {
    type: LocationParseType;
  };
  hideConfigMenu: {
    type: LocationParseType;
  };
  hideLogDownload: {
    type: LocationParseType;
  };
};
