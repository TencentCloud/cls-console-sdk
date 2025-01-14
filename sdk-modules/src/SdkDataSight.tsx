import React from 'react';

import { ISdkApi } from '@tencent/tea-sdk-cls-types';

import { SDKLoader } from './lib/tea-sdk-runner/src';

export const SdkDataSight = React.memo(() => {
  if (!(window as any).TeaSDKRunner) {
    return <div>sdk未初始化</div>;
  }
  return (
    <SDKLoader sdkNames={['cls-sdk']}>
      {(sdks) => {
        const clsSdk: ISdkApi = sdks[0];
        const { DataSightComponent } = clsSdk.DataSight;
        return <DataSightComponent />;
      }}
    </SDKLoader>
  );
});

SdkDataSight.displayName = 'SdkDataSight';
