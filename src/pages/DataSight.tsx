import { History } from 'history';
import React from 'react';

import { SdkDataSight } from '../../sdk-modules/src/SdkDataSight';

/** DataSight管理页 */
export function DataSightPage({}: { history: History }) {
  return (
    <div style={{ display: 'flex', marginTop: 50 }}>
      <div style={{ flex: 3 }}></div>
      <SdkDataSight />
    </div>
  );
}
