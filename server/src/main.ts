import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import "dotenv/config";

import { AppModule } from "./app.module.js";
import { configureApp } from "./configure-app.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  configureApp(app);

  const port = configService.getOrThrow<number>("BACKEND_PORT");

  await app.listen(port);
}

bootstrap().catch((error: unknown) => {
  console.error("Failed to bootstrap application:", error);
  process.exit(1);
});
