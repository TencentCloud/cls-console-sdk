import React, { useState, useEffect, useCallback } from "react";
import { use } from "./use";

const loaderStore = {};

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

export function SDKLoader({
  sdkNames,
  loading: fallback = null,
  error: errorRender = () => null,
  children,
}: SDKLoaderProps) {
  const loaderKey = sdkNames.join("-");
  const [sdks, setSdks] = useState(loaderStore[loaderKey] || []);
  const [loading, setLoading] = useState(!loaderStore[loaderKey]);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSdks([]);
      const sdks = await Promise.all(sdkNames.map(n => use(n)));
      loaderStore[loaderKey] = sdks;
      setSdks(sdks);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [sdkNames]);

  useEffect(() => {
    if (!loaderStore[loaderKey]) {
      load();
    }
  }, [load]);

  if (loading) {
    return <>{fallback}</>;
  }

  if (error) {
    return <>{errorRender(error, load)}</>;
  }

  return <>{children(sdks)}</>;
}
