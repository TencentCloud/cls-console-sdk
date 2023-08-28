import { constantsZh as constants } from './constants';
import { util } from './util';

export const appUtil = {
  setRegionId(rid: number) {
    const { loginUin, ownerUin } = util._getLoginInfo();
    localStorage.setItem(`tea_last_rid_${loginUin}_${ownerUin}`, String(rid));
  },
  getRegionId() {
    const { loginUin, ownerUin } = util._getLoginInfo();
    return Number(localStorage.getItem(`tea_last_rid_${loginUin}_${ownerUin}`)) || 1;
  },

  setProjectId(pid) {
    const { loginUin, ownerUin } = util._getLoginInfo();
    if (pid == -1) {
      localStorage.removeItem(`tea_last_pid_${loginUin}_${ownerUin}`);
    } else {
      localStorage.setItem(`tea_last_pid_${loginUin}_${ownerUin}`, String(pid));
    }
  },

  getProjectId(skipAll: boolean) {
    const { loginUin, ownerUin } = util._getLoginInfo();
    let pid = Number(localStorage.getItem(`tea_last_pid_${loginUin}_${ownerUin}`)) || -1;
    if (skipAll) {
      pid = pid == -1 ? 0 : pid;
    }
    return pid;
  },

  ipToUint(ip: string) {
    const ips = ip.split('.').map((i) => Number(i));
    return ((ips[0] << 24) | (ips[1] << 16) | (ips[2] << 8) | ips[3]) >>> 0;
  },

  isValidCIDR(ip: string, maskLen: number) {
    const mask = ((Math.pow(2, maskLen) - 1) << (32 - maskLen)) >>> 0;
    return (mask | this.ipToUint(ip)) >>> 0 == mask;
  },

  getRegionOrderHackObj(obj = {}) {
    const ridMap = {};
    const arr = constants.REGIONORDER;
    for (let i = 0, len = arr.length; i < len; i++) {
      const rid = arr[i];
      if (obj[rid]) {
        ridMap[`_${rid}`] = obj[rid];
      }
    }
    return ridMap;
  },
};

export const appUtilModules = {
  'lib/appUtil': appUtil,
  appUtil,
};
