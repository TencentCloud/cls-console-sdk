import { Injectable, Logger } from '@nestjs/common';
import { HttpConnection } from 'tencentcloud-sdk-nodejs/tencentcloud/common/http/http_connection';
import TencentCloudSDKHttpException from 'tencentcloud-sdk-nodejs/tencentcloud/common/exception/tencent_cloud_sdk_exception';
import { IAPIErrorResponse, IApiResponse } from './types';
import { ConfigService } from '@nestjs/config';
import { ClientConfig } from 'tencentcloud-sdk-nodejs/src/common/interface';

type ResponseData = any;
interface IApiRequestParams {
  action: string;
  data: any;
  region: string;
  service: string;
  version: string;
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  clientConfig: Partial<ClientConfig & { other: any }>;
  constructor(private configService: ConfigService) {
    this.clientConfig = {
      profile: {
        signMethod: 'TC3-HMAC-SHA256',
        httpProfile: {
          reqMethod: 'POST',
          endpoint: null,
          protocol: 'https://',
          reqTimeout: 60,
        },
        language: 'zh-CN',
      },
      credential: {
        secretId: configService.get('secretId'),
        secretKey: configService.get('secretKey'),
        token: '',
      },
      other: {
        path: '/',
        multipart: false,
        requestClient: '',
        endpointSuffix: configService.get('internal')
          ? '.internal.tencentcloudapi.com'
          : '.tencentcloudapi.com',
      },
    };
  }

  async doCApiRequest(
    param: IApiRequestParams,
  ): Promise<IApiResponse | IAPIErrorResponse> {
    try {
      const response = await this.doRequestWithSign3(param);
      return {
        Response: response,
      };
    } catch (e) {
      this.logger.log('doRequestWithSign3 error: ', e);
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

  async doRequestWithSign3({
    action,
    data,
    region,
    service,
    version,
  }: IApiRequestParams): Promise<ResponseData> {
    const clientConfig = this.clientConfig;
    const { profile, credential } = clientConfig;
    let res;
    const endpoint = service + clientConfig.other.endpointSuffix;
    const url =
      profile.httpProfile.protocol + endpoint + clientConfig.other.path;
    try {
      res = await HttpConnection.doRequestWithSign3({
        region: region,
        data: data || '',
        action: action,
        service: service,
        version: version,

        method: profile.httpProfile.reqMethod,
        timeout: profile.httpProfile.reqTimeout * 1000,
        language: profile.language,
        url: url,
        multipart: clientConfig.other.multipart,
        requestClient: clientConfig.other.requestClient,

        secretId: credential.secretId,
        secretKey: credential.secretKey,
        token: credential.token,
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
