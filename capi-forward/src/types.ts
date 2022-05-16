export interface IApiResponse {
  Response: any;
}

export interface IAPIErrorResponse {
  Response: {
    Error: {
      Code: string;
      Message: string;
    };
    RequestId: string;
  };
}
