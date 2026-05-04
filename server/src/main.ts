import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import cookieParser from "cookie-parser";
import "dotenv/config";

import { AppModule } from "./app.module.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "http://localhost:5173",
    credentials: true,
  });
  app.use(cookieParser());
  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 4200);
}

bootstrap();
