export const manager = {
  /**
   * 查询白名单
   */
  queryWhiteList: function (data: { whiteKey: string[] }, cb, fail, global) {},
};

export const managerModules = {
  "models/manager": manager,
  manager,
};
