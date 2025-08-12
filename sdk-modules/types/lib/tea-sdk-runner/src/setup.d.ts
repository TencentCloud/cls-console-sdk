import { SDKRunnerSetupOptions } from './type';
import './util/chunkLoader';
/**
 * 初始化 Runner
 */
export declare function setup({ sdks, capi, modules, loginInfo, history, language, includeGlobalCss, regionConstants, }: SDKRunnerSetupOptions): void;
