import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { renderSdkDashboard, SdkDashboard, ISdkDashboardPageControl } from '../../sdk-modules/src';

export function DashboardPage() {
  const dashboardPageControlRef = useRef<ISdkDashboardPageControl | null>(null as any);

  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  // return <SdkDashboard controlRef={dashboardPageControlRef} pageParams={{ id: '' }} />;

  const domId = 'cls-sdk-area';
  useEffect(() => {
    const ele = document.querySelector(`#${domId}`)!;
    if (ele) {
      const hideParams: any = {};
      const pageParams: any = {};
      Object.keys(params).forEach((key) => {
        if (key.startsWith('hide')) {
          hideParams[key] = params[key];
        } else {
          pageParams[key] = params[key];
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
  }, [params]);
  return <div id={domId} />;
}
