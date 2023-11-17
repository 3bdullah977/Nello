import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardDto } from './create-board.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateBoardDto extends PartialType(CreateBoardDto) {
  @ApiProperty({ required: false })
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name?: string;

  @ApiProperty({ required: false })
  imageUrl?: string;
}
