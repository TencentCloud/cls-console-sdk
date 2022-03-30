export const getCapiModules = (capi: CAPIRequest) => ({
  "models/api": {
    request: async (body: RequestBody, options: any = {}) => {
      const { global, ...restOptions } = options;

      let result = await capi(body, {
        tipLoading: global,
        ...restOptions,
      });

      if (result.Response && result.code === undefined) {
        const error = result.Response.Error || {};

        result = {
          code: error.Code || 0,
          cgwerrorCode: error.Code || 0,
          data: result,
          message: error.Message,
        };
      }
      return result;
    },
  },
  "models/iaas": {
    apiRequest: async (body: any, options: any = {}) => {
      const { action, ...restBody } = body;
      const { global, ...restOptions } = options;
      let result = await capi(
        {
          cmd: action,
          ...restBody,
        },
        {
          tipLoading: global,
          ...restOptions,
        }
      );
      return result;
    },
  },
});

export type CAPIRequest = (
  body: RequestBody,
  options?: RequestOptions
) => Promise<any>;

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
}

export interface CAPIResponse {}
