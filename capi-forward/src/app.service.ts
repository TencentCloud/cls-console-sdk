import { Injectable } from '@nestjs/common';
import { HttpConnection } from 'tencentcloud-sdk-nodejs/tencentcloud/common/http/http_connection';
import TencentCloudSDKHttpException from 'tencentcloud-sdk-nodejs/tencentcloud/common/exception/tencent_cloud_sdk_exception';
import { IAPIErrorResponse, IApiResponse } from './types';

type ResponseData = any;

const secretId = process.env.secretId;
const secretKey = process.env.secretKey;
// console.log(secretId, secretKey);

const profile = {
  signMethod: 'TC3-HMAC-SHA256',
  httpProfile: {
    reqMethod: 'POST',
    endpoint: null,
    protocol: 'https://',
    reqTimeout: 60,
  },
  language: 'zh-CN',

  credential: {
    secretId: secretId,
    secretKey: secretKey,
    token: '',
  },
  other: {
    path: '/',
    multipart: false,
    sdkVersion: '',
  },
};

@Injectable()
export class AppService {
  async doCApiRequest(
    param: Parameters<typeof AppService.doRequestWithSign3>[0],
  ): Promise<IApiResponse | IAPIErrorResponse> {
    try {
      const response = await AppService.doRequestWithSign3(param);
      return {
        Response: response,
      };
    } catch (e) {
      console.log('doRequestWithSign3 error: ', e);
      if (e.code && e.message) {
        const err: TencentCloudSDKHttpException = e;
        return {
          Response: {
            Error: {
              Code: err.code,
              Message: err.message,
            },
            RequestId: err.requestId,
          },
        };
      }
      return e.message;
    }
  }

  static async doRequestWithSign3({
    action,
    data,
    region,
    service,
    version,
  }: {
    action: string;
    data: any;
    region: string;
    service: string;
    version: string;
  }): Promise<ResponseData> {
    let res;
    const endpoint = service + '.tencentcloudapi.com';
    const url = profile.httpProfile.protocol + endpoint + profile.other.path;
    try {
      res = await HttpConnection.doRequestWithSign3({
        region: region,
        data: data || '',
        action: action,
        service: service,
        version: version,

        method: profile.httpProfile.reqMethod,
        url: url,

        timeout: profile.httpProfile.reqTimeout * 1000,
        secretId: profile.credential.secretId,
        secretKey: profile.credential.secretKey,
        token: profile.credential.token,

        multipart: profile.other.multipart,
        requestClient: profile.other.sdkVersion,
        language: profile.language,
      });
    } catch (e) {
      throw new TencentCloudSDKHttpException(e.message);
    }
    return AppService.parseResponse(res);
  }

  static async parseResponse(res: Response): Promise<ResponseData> {
    if (res.status !== 200) {
      const tcError = new TencentCloudSDKHttpException(res.statusText);
      tcError.httpCode = res.status;
      throw tcError;
    } else {
      const data = await res.json();
      if (data.Response.Error) {
        const tcError = new TencentCloudSDKHttpException(
          data.Response.Error.Message,
          data.Response.RequestId,
        );
        tcError.code = data.Response.Error.Code;
        throw tcError;
      } else {
        return data.Response;
      }
    }
  }
}
