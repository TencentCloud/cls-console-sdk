import { SDKRunnerSDKEntry } from "../type";

let config: SDKRunnerSDKEntry[] = [];

export function register(sdk: SDKRunnerSDKEntry) {
  config.push(sdk);
}

function getSDKEntry(name: string) {
  return config.find(i => i.name === name);
}

export function initSDKImporter({ requireRegionData }) {
  window.define("nmc/sdk/sdk", function (require, exports, module) {
    exports.use = function (sdkName: string) {
      const config = getSDKEntry(sdkName);
      return new Promise((resolve, reject) => {
        if (!config) {
          return reject(new Error(sdkName + " 未配置"));
        }

        const js = config.js;
        const css = (Array.isArray(config.css)
          ? config.css
          : [config.css]
        ).filter(Boolean);

        var failTimer = setTimeout(function () {
          reject(new Error(sdkName + " 加载超时"));
        }, 90000);

        return Promise.all([
          new Promise(resolve =>
            js ? require.async(js, resolve) : resolve(null)
          ),
          new Promise(resolve =>
            css ? require.async(css, resolve) : resolve(null)
          ),
        ]).then(() => {
          clearTimeout(failTimer);
          const moduleId = "sdk/" + sdkName;
          resolve(seajs.require(moduleId));
        });
      });
    };
  });
}

export { use } from "./use";
export { SDKLoader } from "./SDKLoader";
