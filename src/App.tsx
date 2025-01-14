import './polyfill';
import '@tencent/cls-sdk-modules/lib/tea.css';

import { createBrowserHistory } from 'history';
import React, { useMemo } from 'react';
import { Route, Router, Switch } from 'react-router-dom';

import { LoginCheck } from './LoginCheck';
import { DashboardPage } from './pages/Dashboard';
import { DataSightPage } from './pages/DataSight';
import { PageIndex } from './pages/PageIndex';
import { SearchPage } from './pages/Search';

/** SDK外部调用样例，配合 capi-forward 实现控制台SDK复用 */
export default function App() {
  const history = useMemo(() => createBrowserHistory({ basename: '/' }), []);
  return (
    <LoginCheck>
      {() => (
        //  这里使用定高，包装组件内部的滚动逻辑
        <div id="cls" style={{ height: '100%' }}>
          {(window as any).TeaSDKRunner ? (
            <>
              <Router history={history}>
                <Switch>
                  <Route path={'/cls/search'} key={'/cls/search'} exact render={(props) => <SearchPage {...props} />} />
                  <Route
                    path={'/cls/dashboard/d'}
                    key={'/cls/dashboard/d'}
                    exact
                    render={(props) => <DashboardPage {...props} />}
                  />
                  <Route
                    path={'/cls/datasight'}
                    key={'/cls/datasight'}
                    exact
                    render={(props) => <DataSightPage {...props} />}
                  />
                  <Route path={'/'} key={'/'} exact render={(props) => <PageIndex {...props} />} />
                </Switch>
              </Router>
            </>
          ) : null}
        </div>
      )}
    </LoginCheck>
  );
}
