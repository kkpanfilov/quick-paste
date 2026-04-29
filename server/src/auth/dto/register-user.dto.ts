import { IsEmail, IsString, IsStrongPassword, Length } from "class-validator";

export class RegisterUserDto {
  @Length(4, 20, { message: "Username must be at least 4 characters long" })
  @IsString({ message: "Username must be a string" })
  username!: string;

  @IsEmail({}, { message: "Email is not valid" })
  @IsString({ message: "Email must be a string" })
  email!: string;

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
  @Length(6, 20, { message: "Password must be at least 6 characters long" })
  @IsString({ message: "Password must be a string" })
  password!: string;
}
