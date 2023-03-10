import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const API_NAME = 'Mutyne API';
const API_CURRENT_VERSION = '0.0.1';
const SWAGGER_URL = 'docs/swagger-ui';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());

  // Swagger 문서 설정
  const options = new DocumentBuilder()
    .setTitle(API_NAME)
    .setVersion(API_CURRENT_VERSION)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SWAGGER_URL, app, document);

  const port = configService.get('APP_PORT');

  await app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}
bootstrap();
