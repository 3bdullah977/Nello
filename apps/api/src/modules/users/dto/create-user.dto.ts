import { ApiProperty } from '@nestjs/swagger';
import {
  MinLength,
  IsAlphanumeric,
  IsEmail,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @MinLength(3)
  @IsAlphanumeric()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @MinLength(8)
  @MaxLength(100)
  @IsNotEmpty()
  password: string;
}
