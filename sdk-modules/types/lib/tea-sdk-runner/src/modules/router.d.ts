import type { History } from 'history';
export declare const getRouterModules: (history: History) => {
    'nmc/main/router': {
        navigate: (url: any, silent: any, replacement: any) => void;
        redirect: (url: any, silent: any, replacement: any) => void;
    };
    router: {
        navigate: (url: any, silent: any, replacement: any) => void;
        redirect: (url: any, silent: any, replacement: any) => void;
    };
};
