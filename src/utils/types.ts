export interface IAPIErrorResponse {
  Response: {
    Error: {
      Code: string;
      Message: string;
    };
    RequestId: string;
  };
}

export interface IApiError extends Error {
  code: string;
  message: string;
  data?: IAPIErrorResponse;
}

export interface IApiResponse {
  /** 返回code为0，或字段不存在，代表云API请求工作正常 */
  code?: any;
  data: {
    Response: any;
  };
}
