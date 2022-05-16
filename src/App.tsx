import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { LoginCheck } from './LoginCheck';
import { DashboardPage } from './Page/Dashboard';
import { SearchPage } from './Page/Search';
import './polyfill';
import './utils/tea.css';

/** SDK外部调用样例，配合capi-forward实现控制台SDK复用 */
export default function App() {
  return (
    <LoginCheck>
      {() => (
        //  这里使用定高，包装组件内部的滚动逻辑
        <div id="cls">
          {(window as any).TeaSDKRunner && (
            <Routes>
              <Route path={'/'} element={<SearchPage />} />
              <Route path={'/search'} element={<SearchPage />} />
              <Route path={'/dashboard'} element={<DashboardPage />} />
            </Routes>
          )}
        </div>
      )}
    </LoginCheck>
  );
}
