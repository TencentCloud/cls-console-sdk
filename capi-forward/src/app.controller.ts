import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import * as bcryptjs from 'bcryptjs';
import { AppService } from './app.service';
const demoPassword = process.env.demoPassword
  ? bcryptjs.hashSync(process.env.demoPassword, 10)
  : '';
const EXPIRES_DAYS = 2;

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/test')
  testRequest(): any {
    return this.appService.doCApiRequest({
      action: 'DescribeTopics',
      data: { Limit: 20, Offset: 0 },
      region: 'ap-shanghai',
      service: 'cls',
      version: '2020-10-16',
    });
  }

  @Post('/forward')
  capiRequest(@Body() body): any {
    const { action, data, region, service, version } = body;
    return this.appService.doCApiRequest({
      action,
      region,
      service,
      data,
      version,
    });
  }

  @Post('/user/login')
  login(@Body() body, @Res({ passthrough: true }) res: Response): any {
    const { pwd } = body;
    if (!pwd || !bcryptjs.compareSync(pwd, demoPassword)) {
      return {
        code: 401,
        data: 'failed',
      };
    } else {
      const exp = new Date();
      const expires = exp.setTime(
        exp.getTime() + EXPIRES_DAYS * 24 * 60 * 60 * 1000,
      );
      res.cookie('demo-token', demoPassword, {
        sameSite: 'none',
        secure: true,
        expires: new Date(expires),
      });
      return {
        data: 'pass',
      };
    }
  }

  @Get('/user/isLog')
  isLog(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
    if (!demoPassword || request?.cookies?.['demo-token'] === demoPassword) {
      return { data: 'pass' };
    } else {
      // remove cookie
      res.cookie('demo-token', demoPassword, {
        sameSite: 'none',
        secure: true,
        maxAge: 0,
      });
      return {
        data: 'failed',
      };
    }
  }
}
