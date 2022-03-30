export function use<T = any>(sdkName: string): Promise<T> {
  return window.seajs.require("nmc/sdk/sdk")?.use(sdkName);
}
