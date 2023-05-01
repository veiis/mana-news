import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const PORT = process.env.PORT || 3000
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(/*{origin: "any url"}*/)
  app.use(helmet())
  app.use(compression())
  await app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
}

bootstrap();
