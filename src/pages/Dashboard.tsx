import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ISdkDashboardPageControl, renderSdkDashboard } from '@tencent/cls-sdk-modules';

// eslint-disable-next-line @typescript-eslint/no-unused-vars

export function DashboardPage() {
  const dashboardPageControlRef = useRef<ISdkDashboardPageControl | null>(null as any);

  const [searchParams] = useSearchParams();

  // return <SdkDashboard controlRef={dashboardPageControlRef} pageParams={{ id: '' }} />;

  const domId = 'cls-sdk-area';
  useEffect(() => {
    const ele = document.querySelector(`#${domId}`)!;
    if (ele) {
      const hideParams: any = {};
      const pageParams: any = {};
      Array.from(searchParams.keys()).forEach((key) => {
        if (key.startsWith('hide')) {
          hideParams[key] = searchParams.get(key);
        } else {
          const paramValue = searchParams.getAll(key);
          pageParams[key] = paramValue?.length ? paramValue : paramValue[0];
        }
      });
      const { controlRef, destroy } = renderSdkDashboard(
        {
          pageParams,
          hideParams,
        },
        ele,
      );
      dashboardPageControlRef.current = controlRef.current;
      return () => {
        dashboardPageControlRef.current = null;
        destroy?.();
      };
    }
  }, [searchParams]);
  return <div id={domId} />;
}
