import { isNil } from 'lodash-es';

import { CAPIRequest } from './capi';

const cache = {};
const cachePromiseObj = {
  checkFtCloudUserPromiser: undefined,
  checkAutoDrivingCloudUserPromiser: undefined,
};
/**
 * 为了避免业务缓存 manager 下的方法导致 this 指向不对，将 getWhiteListCacheKey 方法提出来
 * 其他方法可能有类似的问题
 *
 * @private
 * @param {string} key
 */
const getWhiteListCacheKey = function (key) {
  return `whitelist_cache_${key}`;
};
export const getManagerModules = (capi: CAPIRequest) => {
  const manager = {
    /**
     * 查询白名单
     */
    queryWhiteList(data: { whiteKey: string[] }, cb, fail) {
      capi({
        regionId: 1,
        serviceType: 'account',
        cmd: 'BatchCheckWhitelist',
        data: {
          WhitelistKeyList: data.whiteKey,
          Version: '2018-12-25',
        },
      })
        .then(({ Response = {} }) => Response)
        .then(({ MatchedWhitelist }) => {
          const result = {};
          MatchedWhitelist.forEach(({ WhitelistKey, WhitelistUinList }) => {
            result[WhitelistKey] = WhitelistUinList.length;
          });
          data.whiteKey?.forEach((whiteKey) => {
            cache[whiteKey] = !!result[whiteKey];
          });
          return result;
        })
        .then(cb)
        .catch(fail);
    },

    getComData(cb) {
      cb({
        ...window.LOGIN_INFO,
        userInfo: { ...window.LOGIN_INFO },
        ownerInfo: { ...window.LOGIN_INFO },
      });
    },

    /**
     * 是否是金融云用户
     *
     * 金融云用户白名单，由金融云团队维护，接口人：rainxiong
     *
     * @param {(error: Error, yes: boolean) => void} callback
     */
    isFtCloudUser(callback) {
      const whiteKey = 'GROUP_CLOUD_JR_WHITELIST';
      this.checkPrivateCloudUser(whiteKey, 'checkFtCloudUserPromiser', callback);
    },

    /**
     * 是否是上海自动驾驶云专区用户
     * 白名单维护人：jiaxinwu
     *
     * @param {*} callback
     */
    isAutoDrivingCloudUser(callback) {
      const whiteKey = 'ADC_SINGEL_ADC_WHITELIST';
      this.checkPrivateCloudUser(whiteKey, 'checkAutoDrivingCloudUserPromiser', callback);
    },

    checkPrivateCloudUser(whiteKey, cachePromiserKey, callback) {
      const cacheData = cache[getWhiteListCacheKey(whiteKey)];
      if (!cachePromiseObj[cachePromiserKey]) {
        cachePromiseObj[cachePromiserKey] = (() => {
          if (cacheData) {
            const cacheResult = {};
            cacheResult[whiteKey] = cacheData;
            return Promise.resolve(cacheResult);
          }
          return new Promise((resolve, reject) => {
            /**
             * 会 block 主链路，增加冗余处理
             */
            let retry = 0;
            const maxRetry = 3;
            const whiteListRequest = () => {
              this.queryWhiteList(
                { whiteKey: [whiteKey] },
                (ret) => {
                  resolve(ret);
                },
                (error) => {
                  const errorMsg =
                    error.msg || error.message || (error instanceof Error ? error.toString() : JSON.stringify(error));
                  if (retry < maxRetry) {
                    retry += 1;
                    whiteListRequest();
                  } else {
                    reject(new Error(errorMsg));
                  }
                },
              );
            };

            whiteListRequest();
          });
        })();
      }

      let cachePromiser = cachePromiseObj[cachePromiserKey];

      cachePromiser
        .then((ret) => {
          if (!isNil(ret[whiteKey])) {
            callback?.(null, !!ret[whiteKey]);
          } else {
            callback?.(null, false);
          }
        })
        .catch((err) => {
          cachePromiser = null;
          callback?.(err, false);
        });
    },
  };
  return {
    'models/manager': manager,
    manager,
  };
};
