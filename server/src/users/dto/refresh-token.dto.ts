import { IsString } from "class-validator";

export class RefreshTokenDto {
  @IsString({
    message: "You did not provide a refresh token or it is not a string",
  })
  refresh_token!: string;
}
