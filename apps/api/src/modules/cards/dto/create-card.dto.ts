import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsString,
} from 'class-validator';

export class CreateCardDto {
  @ApiProperty()
  @IsAlphanumeric()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsAlphanumeric()
  @IsNotEmpty()
  coverImage: string;
}
