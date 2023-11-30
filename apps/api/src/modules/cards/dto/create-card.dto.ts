import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumber,
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
  @IsNumber()
  @IsNotEmpty()
  columnId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsAlphanumeric()
  @IsNotEmpty()
  coverImage: string;
}
