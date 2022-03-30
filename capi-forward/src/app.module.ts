import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    // 直接使用 nest 作为静态资源服务器
    ServeStaticModule.forRoot({
      // 二级父目录dist文件夹内容为 前端项目构建产物
      rootPath: join(__dirname, '../..', 'dist'),
      exclude: ['test', '/capi/**', '/user/**'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
