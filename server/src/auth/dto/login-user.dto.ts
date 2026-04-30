import { IsEmail, IsString, Length } from "class-validator";

export class LoginUserDto {
  @IsEmail({}, { message: "Email is not valid" })
  @IsString({ message: "Email must be a string" })
  email!: string;

  @Length(6, 20, { message: "Password must be at least 6 characters long" })
  @IsString({ message: "Password must be a string" })
  password!: string;
}
