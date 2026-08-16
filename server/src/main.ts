import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import "dotenv/config";

import { AppModule } from "./app.module.js";
import { configureApp } from "./configure-app.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  configureApp(app);

  const PORT = configService.getOrThrow<number>("BACKEND_PORT");

  await app.listen(PORT ?? 4200);
}

bootstrap();
