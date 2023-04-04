import type { History } from 'history';

export const getRouterModules = (history: History) => {
  const router = {
    navigate: (url, silent, replacement) => {
      if (!history) return;
      return (replacement ? history.replace : history.push).call(history, url);
    },
    redirect: (url, silent, replacement) => {
      return router.navigate(url, silent, replacement);
    },
  };
  return {
    'nmc/main/router': router,
    router,
  };
};
