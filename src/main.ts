import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common';
// const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(cookieSession({
  //   keys: ['asdfasf']
  // }));
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //   })
  // )
  await app.listen(3000);
}
bootstrap();
