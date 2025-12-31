import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Amazon Max')
    .setDescription(`API's Amazon Max`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  app.use(bodyParser.json({ limit: '50mb' }));

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Swagger - Amazon Max',
    swaggerOptions: {
      authAction: {
        JWT: {
          name: 'JWT',
          schema: {
            type: 'apiKey',
            in: 'header',
            description: 'Coloque seu token JWT aqui',
          },
          value: 'Bearer <JWT_TOKEN>',
        },
      },
    },
  });

  app.enableCors({
    origin: [
      'http://tauri.localhost',
      'https://amazon.viniciustomaz.com',
      'http://localhost:5173',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3007);
}
bootstrap();
