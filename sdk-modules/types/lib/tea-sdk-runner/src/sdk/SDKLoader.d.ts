import React from "react";
export interface SDKLoaderProps {
    /**
     * 要加载的 SDK 名称数组
     */
    sdkNames: string[];
    /**
     * 加载中占位组件
     */
    loading?: React.ReactNode;
    /**
     * 异常时渲染内容
     */
    error?: (error: Error, retry: () => Promise<void>) => React.ReactNode;
    /**
     * 成功时渲染内容
     */
    children: (sdks: any[]) => React.ReactNode;
}
export declare function SDKLoader({ sdkNames, loading: fallback, error: errorRender, children, }: SDKLoaderProps): JSX.Element;
