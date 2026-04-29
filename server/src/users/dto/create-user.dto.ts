import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
  @Length(4, 20, { message: "Username must be at least 4 characters long" })
  @IsString({ message: "Username must be a string" })
  username!: string;

  @IsEmail({}, { message: "Email is not valid" })
  @IsString({ message: "Email must be a string" })
  email!: string;

  @IsString({ message: "Email must be a string" })
  passwordHash!: string;
}
