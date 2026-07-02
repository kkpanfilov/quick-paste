import { Transform } from "class-transformer";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from "class-validator";

import { UserExposure } from "../../generated/prisma/enums.js";

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: "Username must be a string" })
  @Transform(({ value }): string =>
    typeof value === "string" ? value.trim() : value,
  )
  @Length(4, 20, {
    message: "Username must be at least 4 characters long and no more than 20",
  })
  username?: string;

  @IsOptional()
  @IsString({ message: "Username must be a string" })
  @IsNotEmpty({ message: "Description must not be empty" })
  @MaxLength(1000, {
    message: "Description must be at most 1000 characters long",
  })
  description?: string | null;

  @IsOptional()
  @IsString({ message: "Email must be a string" })
  @Transform(({ value }): string =>
    typeof value === "string" ? value.trim() : value,
  )
  @Length(6, 50, {
    message: "Email must be at least 6 characters long and no more than 50",
  })
  @IsEmail({}, { message: "Email is not valid" })
  email?: string;

  @IsOptional()
  @IsEnum(UserExposure, {
    message: "Exposure must be one of [public, private]",
  })
  @Transform(({ value }): string =>
    typeof value === "string" ? value.toUpperCase() : value,
  )
  exposure?: UserExposure;
}
