import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { renderSdkDashboard, SdkDashboard, ISdkDashboardPageControl } from '../../sdk-modules/src';

export function DashboardPage() {
  const dashboardPageControlRef = useRef<ISdkDashboardPageControl | null>(null as any);

  const [searchParams] = useSearchParams();
  const dashboardId = searchParams.get('id') ?? '';

  // return <SdkDashboard controlRef={dashboardPageControlRef} pageParams={{ id: dashboardId }} />;

  const domId = 'cls-sdk-area';
  useEffect(() => {
    const ele = document.querySelector(`#${domId}`)!;
    if (ele) {
      const { controlRef, destroy } = renderSdkDashboard(
        {
          pageParams: { id: dashboardId },
        },
        ele,
      );
      dashboardPageControlRef.current = controlRef.current;
      return () => {
        dashboardPageControlRef.current = null;
        destroy?.();
      };
    }
  }, [dashboardId]);
  return <div id={domId} />;
}
