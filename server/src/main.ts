import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  let port = process.env.PORT ?? 3000;

  app.use(
  express.json({
    limit: '11mb',
    }),
  );

  app.use(
    express.urlencoded({
      limit: '11mb',
      extended: true,
    }),
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  await app.listen(port, '0.0.0.0');

  console.log(`HTTP server running on http://localhost:${port}`);
}
bootstrap();
