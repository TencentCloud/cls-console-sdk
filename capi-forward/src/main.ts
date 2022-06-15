import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: (origin, callback) => {
        callback(null, true);
      },
      credentials: true,
    },
  });
  const configService = app.get(ConfigService);
  app.use(cookieParser());
  await app.listen(configService.get('port'));
  console.log('App is listening on port ' + configService.get('port'));
}
bootstrap();
