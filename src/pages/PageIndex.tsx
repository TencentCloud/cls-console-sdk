import { History } from 'history';
import React from 'react';
import { useEffectOnce } from 'react-use';

export function PageIndex({ history }: { history: History }) {
  useEffectOnce(() => {
    history.replace(`/cls/search${window.location.search}`, history.location.state);
  });
  return <div />;
}
