import { SDKRunnerSDKEntry } from '../type';

const config: SDKRunnerSDKEntry[] = [];

export function register(sdk: SDKRunnerSDKEntry) {
  config.push(sdk);
}

function getSDKEntry(name: string) {
  return config.find((i) => i.name === name);
}

export function initSDKImporter() {
  const sdk = function (require, exports) {
    // eslint-disable-next-line no-param-reassign
    exports.use = function (sdkName: string) {
      const config = getSDKEntry(sdkName);
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      return new Promise((resolve, reject) => {
        if (!config) {
          return reject(new Error(`${sdkName} 未配置`));
        }

        const { js } = config;
        const css = (Array.isArray(config.css) ? config.css : [config.css]).filter(Boolean);

        const failTimer = setTimeout(() => {
          seajs.destroy(moduleId, config);
          reject(new Error(`${sdkName} 加载超时`));
        }, 90000);

        const fail = function (errorType) {
          reject(new Error(`${(errorType ? `[${errorType}]` : '') + sdkName} 未从指定的入口 "${config.js}" 导出`));
        };

        const moduleId = `sdk/${sdkName}`;
        return Promise.all([
          new Promise((resolve) => (js ? require.async(js, resolve) : resolve(null))),
          new Promise((resolve) => (css ? require.async(css, resolve) : resolve(null))),
        ])
          .then(() => {
            clearTimeout(failTimer);
            if (seajs.has(moduleId)) {
              resolve(seajs.require(moduleId));
            } else {
              // 未成功注册
              fail('NoDefined');
              seajs.destroy(moduleId, config);
            }
          })
          .catch((e) => {
            reject(e);
            seajs.destroy(moduleId, config);
          });
      });
    };
  };
  window.define('nmc/sdk/sdk', sdk);
  window.define('sdk', sdk);
}

export { use } from './use';
export { SDKLoader } from './SDKLoader';
