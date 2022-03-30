export const enum LocationParseType {
  any = 'any',
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  'string[]' = 'string[]',
  'number[]' = 'number[]',
  'boolean[]' = 'boolean[]',
}

export declare type IDashboardAppHideParams = Record<
  keyof typeof DashboardAppHideParamKeyMap,
  boolean
>;

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
  editPanel?: string;
  viewPanel?: string;
  editView?: string;
  time?: string;
}
