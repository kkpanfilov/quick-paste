import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";

export const getJWTConfig = (
  configService: ConfigService,
): JwtModuleOptions => ({
  secret: configService.getOrThrow<string>("JWT_SECRET"),
});
