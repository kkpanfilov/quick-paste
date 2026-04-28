import { IsEmail, Length } from "class-validator";

export class CreateUserDto {
  @Length(3, 20)
  username!: string;

  @IsEmail()
  email!: string;

  passwordHash!: string;
}
