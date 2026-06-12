import { Transform } from "class-transformer";
import { IsEmail, IsString, IsStrongPassword, Length } from "class-validator";

export class RegisterUserDto {
  @IsString({ message: "Username must be a string" })
  @Transform(({ value }): string =>
    typeof value === "string" ? value.trim() : value,
  )
  @Length(4, 20, {
    message: "Username must be at least 4 characters long and no more than 20",
  })
  username!: string;

  @IsString({ message: "Email must be a string" })
  @Transform(({ value }): string =>
    typeof value === "string" ? value.trim() : value,
  )
  @IsEmail({}, { message: "Email is not valid" })
  @Length(6, 50, {
    message: "Email must be at least 6 characters long and no more than 50",
  })
  email!: string;

  @IsString({ message: "Password must be a string" })
  @Transform(({ value }): string =>
    typeof value === "string" ? value.trim() : value,
  )
  @Length(8, 64, {
    message: "Password must be at least 8 characters long and no more than 64",
  })
  @IsStrongPassword(
    {
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
    },
  )
  password!: string;
}
