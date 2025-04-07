/**
 * 设置LocalStorage缓存
 * @param key
 * @param value
 */
export declare function setLocalStorageItem(key: string, value: string): void;
/**
 * 获取缓存值，
 * @param key
 */
export declare function getLocalStorageItem(key: string): any;
/**
 * 清除LocalStorage
 * @param key
 */
export declare function localStorageRemoveItem(key: string): void;
export declare const safeJsonParse: (data: any) => any;
