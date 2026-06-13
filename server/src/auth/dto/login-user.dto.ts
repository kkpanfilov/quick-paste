import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsString, Length } from "class-validator";

export class LoginUserDto {
  @IsString({ message: "Email must be a string" })
  @Transform(({ value }): string =>
    typeof value === "string" ? value.trim() : value,
  )
  @IsEmail({}, { message: "Email is not valid" })
  email!: string;

  @IsString({ message: "Password must be a string" })
  @Transform(({ value }): string =>
    typeof value === "string" ? value.trim() : value,
  )
  @Length(8, 20, { message: "Password must be at least 6 characters long" })
  password!: string;

  @IsBoolean({ message: "Remember must be a boolean" })
  remember!: boolean;
}
