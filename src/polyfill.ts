/* eslint-disable @typescript-eslint/no-require-imports */
/** polyfill 新版ES的API方法或类的依赖 */
// @babel/presets默认只对syntax进行转换，需要使用以下依赖来提供对api的的支持。

// js标准库 平台已经打了补丁，版本为3.15.2
// import 'core-js/stable';

// 对 generator/yeild， async/await 等的支持。平台已支持
import 'regenerator-runtime/runtime';
