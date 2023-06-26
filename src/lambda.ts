import { configure } from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { createdocument } from './swagger';

let cachedServer;

export const handler = async (event, context) => {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);

    // setting up the swagger docs
    SwaggerModule.setup('docs', app, createdocument(app));

    // enabling cors
    app.enableCors();

    await app.init();

    cachedServer = configure({
      app: app.getHttpAdapter().getInstance(),
    });
  }

  return cachedServer(event, context);
};
