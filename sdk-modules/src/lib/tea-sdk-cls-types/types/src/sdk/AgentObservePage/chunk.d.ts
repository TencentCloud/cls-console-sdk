import React from 'react';

export type { ISdkAgentObservePageControl, ISdkAgentObservePageProps } from './SdkAgentObservePage';

/** Agent 可观测页面路由组件（包含概览页 + 详情页路由） */
export declare const AgentObservePageRoutes: React.ComponentType<
  import('./SdkAgentObservePage').ISdkAgentObservePageProps & React.RefAttributes<any>
>;

/** Agent 可观测详情页组件（独立详情页） */
export declare const AgentObserveDetailPageComponent: React.ComponentType<
  import('./SdkAgentObservePage').ISdkAgentObservePageProps & React.RefAttributes<any>
>;
