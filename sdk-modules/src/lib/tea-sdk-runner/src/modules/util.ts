export const util = {
  _getLoginInfo: function () {
    let loginUin = 0;
    let ownerUin = 0;

    const loginInfo = window.LOGIN_INFO || {};
    if (loginInfo) {
      loginUin = loginInfo.loginUin || 0;
      ownerUin = loginInfo.ownerUin || 0;
    }
    return { ...loginInfo, loginUin, ownerUin };
  },

  /**
   * 获取uin
   * @method getUin
   * @return {String} uin
   */
  getUin: function () {
    return this._getLoginInfo().loginUin;
  },

  /**
   * 获取 ownerUin
   */
  getOwnerUin: function () {
    return this._getLoginInfo().ownerUin;
  },
};

export const utilModules = {
  "nmc/lib/util": util,
  util,
};
