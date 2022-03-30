// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
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
  app.use(cookieParser());
  await app.listen(3001);
  // console.log(process.env);
}
bootstrap();
