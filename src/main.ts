import { NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { createdocument } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // getting the config service
  const configService = app.get(ConfigService);

  // getting the port env var
  const PORT = configService.get<number>('config.app.port');

  // setting up the swagger docs
  SwaggerModule.setup('docs', app, createdocument(app));

  // enabling cors
  app.enableCors();

  // enabling versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(PORT, () => {
    Logger.log(`app listening at ${PORT}`, 'main.ts');
  });
}

bootstrap();
