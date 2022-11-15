import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import './polyfill';
import '@tencent/cls-sdk-modules/lib/tea.css';

import { LoginCheck } from './LoginCheck';
import { DashboardPage } from './pages/Dashboard';
import { SearchPage } from './pages/Search';

/** SDK外部调用样例，配合 capi-forward 实现控制台SDK复用 */
export default function App() {
  return (
    <LoginCheck>
      {() => (
        //  这里使用定高，包装组件内部的滚动逻辑
        <div id="cls" style={{ height: "100%" }}>
          {(window as any).TeaSDKRunner && (
            <Routes>
              <Route path={'/'} element={<SearchPage />} />
              <Route path={'/cls/search'} element={<SearchPage />} />
              <Route path={'/cls/dashboard/d'} element={<DashboardPage />} />
              <Route path="*" element={<Navigate to="/cls/search" replace />} />
            </Routes>
          )}
        </div>
      )}
    </LoginCheck>
  );
}
