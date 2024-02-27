/**
 * 声明具有路由关系的业务模块
 *
 * 模块遵循 [CMD 规范](https://github.com/seajs/seajs/issues/242)
 *
 * 业务模块的 moduleId 与业务的路由有约定关系：
 *
 *   - 路由 `/cvm` 的 moduleId 为 `/modules/cvm/index/index`
 *   - 路由 `/cvm/list` 的 moduleId 为 `modules/cvm/list/list`
 *
 * 业务模块返回一个业务对象，实现 `render()` 和 `destroy()` 两个生命周期方法
 *
 * @example
 *
 ```js
  // 业务进入 https://console.cloud.tencent.com/cvm 时加载并使用此模块
  define('/modules/cvm/index/index', function(require) {
    return {
      render: function() {
        nmc.render('<div>This is cvm home page</div>', 'cvm');
      },

      destroy: function() {
        // do some clean up here
      }
    }
  })
  ```
  */
declare function define(moduleId: string, factory: (require: any, exports: any, module: any) => void): void;

/**
 * CMD 环境，由 seajs 提供
 */
declare const seajs: {
  Module?: any;
  cache?: any;
  data?: any;

  /**
   * 获取已加载过的 CMD 模块，控制台内置模块都在业务加载前已经提前加载了
   */
  require: (moduleId: string) => any;

  /**
   *  异步加载新的 CMD 模块
   */
  use: (moduleId: string, cb: Callback) => void;

  /** 自定义has方法，用于检测模块是否真实存在，而不是proxy的假对象 */
  has: (moduleId: string) => boolean;

  /**
   * 销毁模块，这里仅销毁 seajs 内部的缓存值，不会操作 `script` 和 `link` 标签
   **/
  destroy: (moduleId: string, config: { js: string; css?: string | [string] }) => void;
};

/**
 * 控制台在全局变量 window 上的主要对象是 CMD 环境和 nmc
 */
declare interface Window {
  define: typeof define;
  seajs: typeof seajs;
  LOGIN_INFO: Record;
  React16: any;
  ReactDOM16: any;
  TeaSDKRunner: any;
  getLifeInfo: () => Object;
  QCCDN_HOST: string;
}

/**
 * 表示一个回调函数，回调函数获取的数据类型为 <T>
 */
declare type Callback<T = any> = (data: T) => void;
