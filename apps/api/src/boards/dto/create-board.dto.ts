import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateBoardDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  creatorId: number;

  @ApiProperty({ required: false })
  isPrivate: boolean;
}
