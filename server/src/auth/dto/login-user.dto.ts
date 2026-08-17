import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsString, Length } from "class-validator";

export class LoginUserDto {
  @IsString({ message: "Email must be a string" })
  @Transform(({ value }): string =>
    typeof value === "string" ? value.trim() : value,
  )
  @Length(6, 50, {
    message: "Email must be at least 6 characters long and no more than 50",
  })
  @IsEmail({}, { message: "Email is not valid" })
  email!: string;

  @IsString({ message: "Password must be a string" })
  @Length(8, 64, {
    message:
      "Password must be at least 8 characters long and no more than 64 characters",
  })
  password!: string;

  @IsBoolean({ message: "Remember must be a boolean" })
  remember!: boolean;
}
