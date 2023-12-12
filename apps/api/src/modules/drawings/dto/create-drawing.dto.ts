import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateDrawingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;
}
