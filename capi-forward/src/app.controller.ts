import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import * as bcryptjs from 'bcryptjs';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller('/clsApi')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) { }

  @Get('/test')
  testRequest(@Req() request: Request): any {
    if (!this.isRequestLoggedIn(request)) {
      return {
        code: 401,
        data: 'failed',
      };
    }
    return this.appService.doCApiRequest({
      action: 'DescribeTopics',
      data: { Limit: 20, Offset: 0 },
      region: 'ap-shanghai',
      service: 'cls',
      version: '2020-10-16',
      language: 'zh-CN',
    });
  }

  /**
   * 获取提供给前端使用的环境变量
   */
  @Get('/config/env')
  getEnv(@Req() request: Request): any {
    if (!this.isRequestLoggedIn(request)) {
      return {
        code: 401,
        data: 'failed',
      };
    }
    const envList = ['CLS_DEPLOYMENT_HOST']

    try {
      return {
        code: 0,
        data: envList.reduce((acc, envName) => {
          acc[envName] = process.env[envName]
          return acc;
        }, {})
      };
    } catch (error) {
      console.error('getEnv failed', error)
      return {
        code: 500,
        data: {}
      }
    }


  }


  @Post('/forward')
  capiRequest(@Req() request: Request, @Body() body): any {
    if (!this.isRequestLoggedIn(request)) {
      return {
        code: 401,
        data: 'failed',
      };
    }

    const { action, data, region, service, version } = body;
    const { language } = request.cookies;
    return this.appService.doCApiRequest({
      action,
      region,
      service,
      data,
      version,
      language,
    });
  }

  isRequestLoggedIn(request: Request) {
    const capiPassword = this.configService.get('capiPassword');
    return !capiPassword || request?.cookies?.['demo-token'] === capiPassword;
  }

  @Get('/user/isLog')
  isLog(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
    if (this.isRequestLoggedIn(request)) {
      return { data: 'pass' };
    } else {
      // remove cookie
      res.cookie('demo-token', '', {
        sameSite: 'none',
        secure: true,
        maxAge: 0,
      });
      return {
        data: 'failed',
      };
    }
  }

  @Post('/user/login')
  login(@Body() body, @Res({ passthrough: true }) res: Response): any {
    const { pwd } = body;
    const capiPassword = this.configService.get('capiPassword');
    if (!pwd || !bcryptjs.compareSync(pwd, capiPassword)) {
      return {
        code: 401,
        data: 'failed',
      };
    } else {
      const exp = new Date();
      const EXPIRES_DAYS = 0.2;
      const expires = exp.setTime(
        exp.getTime() + EXPIRES_DAYS * 24 * 60 * 60 * 1000,
      );
      res.cookie('demo-token', capiPassword, {
        sameSite: 'lax',
        expires: new Date(expires),
      });
      return {
        data: 'pass',
      };
    }
  }
}
