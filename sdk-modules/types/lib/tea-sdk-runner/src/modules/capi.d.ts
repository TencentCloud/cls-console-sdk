export declare const getCapiModules: (capi: CAPIRequest) => {
    'models/api': {
        request: (body: RequestBody, options?: any) => Promise<any>;
    };
    'models/iaas': {
        apiRequest: (body: any, options?: any) => Promise<any>;
    };
};
export type CAPIRequest = (body: RequestBody, options?: RequestOptions) => Promise<any>;
export interface RequestBody {
    /**
     * 请求的云 API 地域
     */
    regionId: number;
    /**
     * 请求的云 API 业务
     */
    serviceType: string;
    /**
     * 请求的云 API 名称
     */
    cmd: string;
    /**
     * 请求的云 API 数据
     */
    data?: any;
}
export interface RequestOptions {
    /**
     * 是否使用安全的临时密钥 API 方案，建议使用 true
     * @default true
     */
    secure?: boolean;
    /**
     * 使用的云 API 版本，该参数配合 secure 使用
     *
     *   - `secure == false`，该参数无意义
     *   - `secure == true && version = 1`，将使用老的临时密钥服务进行密钥申请，否则使用新的密钥服务
     *   - `secure == true && version = 3`，使用云 API v3 域名请求，不同地域域名不同
     */
    version?: number;
    /**
     * 是否将客户端 IP 附加在云 API 的 `clientIP` 参数中
     */
    withClientIP?: boolean;
    /**
     * 是否将客户端 UA 附加在云 API 的 `clientUA` 参数中
     */
    withClientUA?: boolean;
    /**
     * 是否在顶部显示接口错误
     * 默认为 true，会提示云 API 调用错误信息，如果自己处理异常，请设置该配置为 false
     * @default true
     */
    tipErr?: boolean;
    /**
     * 请求时是否在顶部显示 Loading 提示
     * @default true
     */
    tipLoading?: boolean;
    /**
     * @description 请求中断信号量
     */
    signal?: AbortSignal;
}
export declare const duplicatePromiseCombine: (promiseFn: Function, keyGenFn: Function) => () => any;
/**
 * 普通对象深拷贝(不支持递归对象)
 * @param obj
 * @returns {Object}
 * @author justanzhu
 */
export declare function clone(obj: any): any;
export declare const keyGen: (body: any, options: any) => string;
