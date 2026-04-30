import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import "dotenv/config";

import { AppModule } from "./app.module.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 4200);
}

bootstrap();
