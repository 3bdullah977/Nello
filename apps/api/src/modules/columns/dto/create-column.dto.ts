import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateColumnDto {
  @ApiProperty()
  @IsAlphanumeric()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;
}
