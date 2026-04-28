import { IsEmail, IsStrongPassword, Length } from "class-validator";

export class RegisterUserDto {
  @Length(3, 20)
  username!: string;

  @IsEmail()
  email!: string;

  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password!: string;
}
