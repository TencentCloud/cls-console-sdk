import { CAPIRequest } from './capi';
export declare const getManagerModules: (capi: CAPIRequest) => {
    'models/manager': {
        /**
         * 查询白名单
         */
        queryWhiteList(data: {
            whiteKey: string[];
        }, cb: any, fail: any): void;
        getComData(cb: any): void;
        /**
         * 是否是金融云用户
         *
         * 金融云用户白名单，由金融云团队维护，接口人：rainxiong
         *
         * @param {(error: Error, yes: boolean) => void} callback
         */
        isFtCloudUser(callback: any): void;
        /**
         * 是否是上海自动驾驶云专区用户
         * 白名单维护人：jiaxinwu
         *
         * @param {*} callback
         */
        isAutoDrivingCloudUser(callback: any): void;
        checkPrivateCloudUser(whiteKey: any, cachePromiserKey: any, callback: any): void;
    };
    manager: {
        /**
         * 查询白名单
         */
        queryWhiteList(data: {
            whiteKey: string[];
        }, cb: any, fail: any): void;
        getComData(cb: any): void;
        /**
         * 是否是金融云用户
         *
         * 金融云用户白名单，由金融云团队维护，接口人：rainxiong
         *
         * @param {(error: Error, yes: boolean) => void} callback
         */
        isFtCloudUser(callback: any): void;
        /**
         * 是否是上海自动驾驶云专区用户
         * 白名单维护人：jiaxinwu
         *
         * @param {*} callback
         */
        isAutoDrivingCloudUser(callback: any): void;
        checkPrivateCloudUser(whiteKey: any, cachePromiserKey: any, callback: any): void;
    };
};
