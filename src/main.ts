import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const PORT = process.env.PORT || 3000
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet())
  app.enableCors(/*{origin: "any url"}*/)
  await app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
}

bootstrap();
