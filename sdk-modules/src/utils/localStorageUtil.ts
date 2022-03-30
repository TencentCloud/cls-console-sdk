/**
 * 设置LocalStorage缓存
 * @param key
 * @param value
 */
export function setLocalStorageItem(key: string, value: string) {
  try {
    // eslint-disable-next-line no-restricted-syntax
    localStorage.setItem(key, value);
  } catch {}
}

/**
 * 获取缓存值，
 * @param key
 */
export function getLocalStorageItem(key: string) {
  let cacheValue = null;
  try {
    // eslint-disable-next-line no-restricted-syntax
    cacheValue = localStorage.getItem(key);
  } catch {}
  return cacheValue;
}
/**
 * 清除LocalStorage
 * @param key
 */
export function localStorageRemoveItem(key: string) {
  try {
    // eslint-disable-next-line no-restricted-syntax
    localStorage.removeItem(key);
  } catch {}
}

export const safeJsonParse = (data) => {
  try {
    // eslint-disable-next-line no-restricted-syntax
    return JSON.parse(data);
  } catch (e) {
    return data || null;
  }
};
