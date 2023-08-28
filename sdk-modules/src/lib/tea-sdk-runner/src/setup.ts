import { isArray } from 'lodash';

import { appUtilModules } from './modules/appUtil';
import { getCapiModules } from './modules/capi';
import { ClipboardJs } from './modules/clipboard';
import { getConstantsModules } from './modules/constants';
import { getManagerModules } from './modules/manager';
import { getRouterModules } from './modules/router';
import { tipsModules } from './modules/tips';
import { utilModules } from './modules/util';
import { register, initSDKImporter } from './sdk';
import { SDKRunnerEnvModules, SDKRunnerSetupOptions } from './type';
import { proxy } from './util/proxy';
import Seajs from './util/sea';
import { initSupport } from './util/support';
import { warn } from './util/warn';

/**
 * 准备 Seajs 环境
 */
function initShim(modules: SDKRunnerEnvModules) {
  if (window.seajs) {
    return;
  }
  Seajs(window);

  // @ts-ignore
  window.seajs.Module = proxy(window.seajs.Module);
  if (!window.define || !window.seajs) {
    throw new Error('需要 Sea.js 运行环境');
  }

  const { define } = window;

  window.define = (moduleId, factory) => {
    const _factory = (require, exports, module) => {
      const _require = Object.assign((moduleId: string) => {
        const m = require(moduleId);
        if (!m && !modules[moduleId]) {
          warn(`模块 ${moduleId} 未定义`);
        }
        return m ? m : proxy(modules[moduleId]);
      }, require);
      return factory(_require, exports, module);
    };
    define(moduleId, _factory);
  };

  const seaRequire = window.seajs.require;

  window.seajs = {
    ...(window.seajs || {}),
    use: (moduleId, cb) => {
      if (!modules[moduleId]) {
        warn(`模块 ${moduleId} 未定义`);
      }
      cb?.(proxy(modules[moduleId]));
    },
    require: (moduleId) => {
      const m = seaRequire(moduleId);
      if (!m && !modules[moduleId]) {
        warn(`模块 ${moduleId} 未定义`);
      }
      return m ? m : proxy(modules[moduleId]);
    },
    /** 自定义has方法，用于检测模块是否真实存在，而不是proxy的假对象 */
    has: (moduleId) => {
      const m = seaRequire(moduleId);
      return !!m;
    },
    /**
     * 销毁模块，这里仅销毁 seajs 内部的缓存值，不会操作 `script` 和 `link` 标签
     **/
    destroy: (moduleId, config) => {
      try {
        const url = window.seajs.Module.resolve(moduleId);
        // eslint-disable-next-line no-nested-ternary
        [url, config.js, ...(config.css ? (isArray(config.css) ? config.css : [config.css]) : [])].forEach((url) => {
          delete window.seajs.cache[url];
          delete window.seajs.data.fetchedList[url];
        });
      } catch (e) {
        console.warn(`module(${moduleId}) destroy fail`);
      }
    },
  };
}

/**
 * 合并内置模块
 */
function mergeBuildInModules(buildInModules: SDKRunnerEnvModules, modules: SDKRunnerEnvModules): SDKRunnerEnvModules {
  const mergedModules = {};
  Object.entries(buildInModules).forEach(([id, module]) => {
    mergedModules[id] = {
      ...module,
      ...(modules[id] || {}),
    };
  });
  return mergedModules;
}

/**
 * 初始化 Runner
 */
export function setup({ sdks = [], capi, modules = {}, loginInfo, history, language }: SDKRunnerSetupOptions) {
  // tips 包含在 menus 中
  // @ts-ignore
  window.g_buffet_data = proxy({ menuRouter: {} });
  // @ts-ignore
  window.Insight = proxy();

  if (!sdks.some((sdk) => sdk.name === 'menus-sdk')) {
    sdks.push({
      name: 'menus-sdk',
      js: 'https://cloudcache.tencent-cloud.com/qcloud/tea/sdk/menus.zh.214a92de3d.js?max_age=31536000',
      css: 'https://cloudcache.tencent-cloud.com/qcloud/tea/sdk/menus.zh.626c9dbc53.css?max_age=31536000',
    });
  }

  sdks.forEach((sdk) => register(sdk));

  if (loginInfo) {
    window.LOGIN_INFO = loginInfo;
  }

  // eslint-disable-next-line no-param-reassign
  modules = {
    ...modules,
    ...mergeBuildInModules(getConstantsModules(language), modules),
    ...mergeBuildInModules(getCapiModules(capi), modules),
    ...mergeBuildInModules(tipsModules, modules),
    ...mergeBuildInModules(appUtilModules, modules),
    ...mergeBuildInModules(utilModules, modules),
    ...mergeBuildInModules(getRouterModules(history), modules),
    ...mergeBuildInModules(getManagerModules(capi), modules),
    clipboard: ClipboardJs,
  };

  // @ts-ignore
  window.TeaSDKRunner = modules;

  initShim(modules);
  initSupport();
  initSDKImporter();
}
