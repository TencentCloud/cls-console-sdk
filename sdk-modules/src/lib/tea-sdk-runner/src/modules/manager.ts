import { CAPIRequest } from './capi';

export const getManagerModules = (capi: CAPIRequest) => {
  let manager = {
    /**
     * 查询白名单
     */
    queryWhiteList: function (data: { whiteKey: string[] }, cb, fail) {
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
          return result;
        })
        .then(cb)
        .catch(fail);
    },

    getComData: function (cb) {
      cb({
        ...window.LOGIN_INFO,
        userInfo: { ...window.LOGIN_INFO },
        ownerInfo: { ...window.LOGIN_INFO },
      });
    },
  };
  return {
    'models/manager': manager,
    manager,
  };
};
