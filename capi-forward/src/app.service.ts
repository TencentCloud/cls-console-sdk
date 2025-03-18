import { Injectable, Logger, MessageEvent } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { from, isObservable, map, Observable } from 'rxjs';
import {
  ClientConfig,
  Credential,
} from 'tencentcloud-sdk-nodejs/src/common/interface';
import TencentCloudSDKHttpException from 'tencentcloud-sdk-nodejs/tencentcloud/common/exception/tencent_cloud_sdk_exception';
import { HttpConnection } from 'tencentcloud-sdk-nodejs/tencentcloud/common/http/http_connection';
import { SSEResponseModel } from 'tencentcloud-sdk-nodejs/tencentcloud/common/sse_response_model';

import { IAPIErrorResponse, IApiResponse } from './types';

type ResponseData = any;
interface IApiRequestParams {
  action: string;
  data: any;
  region: string;
  service: string;
  version: string;
  language: string;
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
  ): Promise<IApiResponse | IAPIErrorResponse | Observable<MessageEvent>> {
    try {
      const response = await this.doRequestWithSign3(param);
      if (isObservable(response)) {
        return response as Observable<MessageEvent>;
      }
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
    language,
  }: IApiRequestParams): Promise<ResponseData> {
    const { clientConfig } = this;
    const { profile, credential } = clientConfig;

    const serviceName = String(service).replace(/[^0-9a-zA-Z]/g, '');
    let res;
    const endpoint = serviceName + clientConfig.other.endpointSuffix;
    const url =
      profile.httpProfile.protocol + endpoint + clientConfig.other.path;

    let capiLanguage;
    if (language) {
      switch (language) {
        case 'en':
          capiLanguage = 'en-US';
          break;
        case 'zh':
          capiLanguage = 'zh-CN';
          break;
      }
    }
    if (!capiLanguage) {
      capiLanguage = profile.language;
    }

    try {
      res = await HttpConnection.doRequestWithSign3({
        region,
        data: data || '',
        action,
        service: serviceName,
        version,

        method: profile.httpProfile.reqMethod,
        timeout: profile.httpProfile.reqTimeout * 1000,
        language: capiLanguage,
        url,
        multipart: clientConfig.other.multipart,
        requestClient: clientConfig.other.requestClient,

        secretId: (credential as Credential).secretId,
        secretKey: (credential as Credential).secretKey,
        token: (credential as Credential).token,
      });
    } catch (e) {
      throw new TencentCloudSDKHttpException(e.message);
    }

    // sse
    if (res.headers?.get('content-type') === 'text/event-stream') {
      const sseResponseModel = new SSEResponseModel(res.body);
      const obs = from(sseResponseModel[Symbol.asyncIterator]());
      return obs.pipe(
        map((chunk) => {
          const nestMessageEvent: MessageEvent = {
            data: chunk.data,
            id: chunk.id,
            type: chunk.event,
            retry: chunk.retry,
          };
          try {
            nestMessageEvent.data = JSON.parse(chunk.data);
          } catch (e) {}
          return nestMessageEvent;
        }),
      );
    }
    // json
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
