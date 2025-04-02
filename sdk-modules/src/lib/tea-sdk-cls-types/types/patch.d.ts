import { Moment } from 'moment';

/** 将 src 中使用到的 app 文件夹的类型内容，统一放到此处 */
export declare type TimeRange = [Moment, Moment];

export declare const enum LocationParseType {
  any = 'any',
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  'string[]' = 'string[]',
  'number[]' = 'number[]',
  'boolean[]' = 'boolean[]',
}

export declare type IDashboardAppHideParams = Record<keyof typeof DashboardAppHideParamKeyMap, boolean>;
export declare const DashboardAppHideParamKeyMap: {
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
  hideRelativeTimeOptions: {
    type: LocationParseType;
  };
  /** @internal 关闭图表视区检测加载逻辑。这里hide指关闭此项特性 */
  hidePanelViewportLoad: {
    type: LocationParseType;
  };
  hideQueryPreview: {
    type: LocationParseType;
  };
  hidePreviewInSearch: {
    type: LocationParseType;
  };
  hideFullScreen: {
    type: LocationParseType;
  };
  hideTitleInHeader: {
    type: LocationParseType;
  };
  hideDashboardSelector: {
    type: LocationParseType;
  };
  hideAnonymousSharing: {
    type: LocationParseType;
  };
  hideSharing: {
    type: LocationParseType;
  };
  hidePanelsHeaderMenu: {
    type: LocationParseType;
  };
  hideBasicInfo: {
    type: LocationParseType;
  };
  hideVariableFilter: {
    type: LocationParseType;
  };
  hideOpenCls: {
    type: LocationParseType;
  };
  disableVariablePicker: {
    type: LocationParseType;
  };
  hideDataSourcePicker: {
    type: LocationParseType;
  };
  hideExport: {
    type: LocationParseType;
  };
  hideSaveAsMetric: {
    type: LocationParseType;
  };
  noPadding: {
    type: LocationParseType;
  };
  hideEditDashboard: {
    type: LocationParseType;
  };
  hideWidget: {
    type: LocationParseType;
  };
  hideTopNav: {
    type: LocationParseType;
  };
  hideLeftNav: {
    type: LocationParseType;
  };
};

export interface DashboardPageRouteSearchParams extends IDashboardAppHideParams, VarUrlParams {
  /** 仪表盘id。和templateId同时仅需要一个，templateId 优先 */
  id?: string;
  /**
   * 预设仪表盘类型，格式为 `${云产品简称}-${场景名称}`，如 `tke-audit-overview`
   * 提供了此参数后，id不再工作，直接查询模板仪表盘，结合路由参数进行渲染
   */
  templateId?: string;

  editPanel?: string;
  viewPanel?: string;
  editView?: string;
  time?: string;
  // refresh?: string;
  /**
   * @description 数据转换和检索语句编辑器tab_id
   */
  tab_id?: PanelEditorTabId;
  /**
   * @description 是否启用数据转换
   */
  transform_enabled?: PanelEditorTransformEnabled;
}
export const enum ThemeName {
  light = 'light',
  dark = 'dark',
  mix = 'mix',
  brand = 'brand',
}

export const AppHideParamKeyMap = {
  /* hideWidget hideTopNav hideLeftNav 参数为平台提供的隐藏参数
   * 隐藏 智能客服button、顶部导航、左侧导航
   * 仅首次页面打开时取值为 非空 有效，后续触发 actionType 不再响应
   */
  hideWidget: { type: LocationParseType.boolean },
  hideTopNav: { type: LocationParseType.boolean },
  hideLeftNav: { type: LocationParseType.boolean },
};

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
  hideWidget: { type: LocationParseType.boolean };
  hideTopNav: { type: LocationParseType.boolean };
  hideLeftNav: { type: LocationParseType.boolean };

  // 隐藏顶部Header，包括title区域与返回按钮
  hideHeader: { type: LocationParseType.boolean };
  hideTopTips: { type: LocationParseType.boolean };
  hideTopicSelect: { type: LocationParseType.boolean };

  hideConfigMenu: { type: LocationParseType.boolean };
  hideLogDownload: { type: LocationParseType.boolean };
  hideDashboard: { type: LocationParseType.boolean };
  hideAlert: { type: LocationParseType.boolean };
  hideScheduleSql: { type: LocationParseType.boolean };
  hideDashboardMenu: { type: LocationParseType.boolean };
  hideAlertMenu: { type: LocationParseType.boolean };
  hideCollectionMenu: { type: LocationParseType.boolean };
  hideIndexMenu: { type: LocationParseType.boolean };
  hideMoreMenu: { type: LocationParseType.boolean };
  hideFavorite: { type: LocationParseType.boolean };
  hideHistory: { type: LocationParseType.boolean };
  hideSharing: { type: LocationParseType.boolean };
  hideAnonymousSharing: { type: LocationParseType.boolean };
  hideRelativeTimeOptions: { type: LocationParseType.boolean };
  disableQueryInput: { type: LocationParseType.boolean }; // 禁用后，页面上检索语句将变为readonly态，不允许用户通过任何方式修改检索语句
  /** hideHeader和hideTopicSelect同时生效时,去掉检索页顶部 padding */
  noPadding: { type: LocationParseType.boolean };
  noSearchPadding: { type: LocationParseType.boolean };

  oldTopicSelect: { type: LocationParseType.boolean };
  collapseTopicSelect: { type: LocationParseType.boolean };
  collapseFastAnalysis: { type: LocationParseType.boolean };
  showContext: { type: LocationParseType.boolean };
  hideQueryRecommend: { type: LocationParseType.boolean };
  hideLogDisplayConfig: { type: LocationParseType.boolean };
  hideFullScreen: { type: LocationParseType.boolean };
};

export interface ISdkSearchPageControl {
  updatePageParams?: (pageParams: Partial<ISdkSearchPageProps['pageParams']>) => void;
  updateHideParams?: (hideParams: Partial<ISdkSearchPageProps['hideParams']>) => void;
}
export interface ISdkSearchPageProps extends IThemedComponentProps {
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
    topicType?: TopicTypeEnum;
    multiple?: boolean;
    queryBase64?: string;
    interactiveQueryBase64?: string;
    grammarVersion?: string;
    /** @deprecated 后续不再支持 */
    // filter?: string;
    /** @deprecated 后续无需传递 */
    logsetId?: string;
    urlAssumerName?: string;
  };
  /** 页面隐藏参数 */
  hideParams?: Partial<ISearchAppHideParams>;
  /** 当页面参数变更时通知SDK调用者，调用方可自行将页面参数同步到路由。
   * Sdk组件不是`纯受控组件` 不推荐直接用于修改 pageParams，应当仅在需要外部注入新数据时，修改 pageParams */
  onPageParamsUpdate?: (param: ISdkSearchPageProps['pageParams']) => void;
  customLogClick?: ICustomButtonWithKey[];
  customCountElement?: React.ReactElement;
  logOptionsColumn?: { buttons: ICustomButton[]; columnWidth?: number };
  sdkFormatTemplate?: ICloudLogFormatConfig;
  /** 发起新请求时，会同步查询sideQuery */
  sideQuery?: ISearchLogSideQuery;
}
