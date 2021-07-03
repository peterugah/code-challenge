import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envConfigVariables } from './config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // use port from config service
  const config = app.get(ConfigService);

  const port = config.get(envConfigVariables.port) || 3000;

  //set the global prefix for the endpoints
  app.setGlobalPrefix('api');

  await app.listen(port);
}
bootstrap();
