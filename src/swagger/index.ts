import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export function createdocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('Empowerment Labs Challenge API')
    .setDescription('A challenge API for Empowerment Labs')
    .setVersion('1.0')
    .addServer(`http://localhost:${process.env.PORT}`, 'Local')
    .addServer(`https://czg0fzyp51.execute-api.us-west-1.amazonaws.com`, 'Production')
    .addBearerAuth({ bearerFormat: 'JWT', type: 'http' })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  return document;
}
