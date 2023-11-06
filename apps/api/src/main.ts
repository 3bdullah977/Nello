import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  const config = new DocumentBuilder()
    .setTitle('Nello')
    .setDescription('Trello clone')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.setGlobalPrefix('/api/v1', { exclude: ['/'] });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/documentation', app, document);
  await app.listen(3001, '0.0.0.0');
}
bootstrap();
