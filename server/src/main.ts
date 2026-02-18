import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  let port = process.env.PORT ?? 3027;

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  await app.listen(port, '0.0.0.0');

  console.log(`HTTP server running on http://localhost:${port}`);
}
bootstrap();
