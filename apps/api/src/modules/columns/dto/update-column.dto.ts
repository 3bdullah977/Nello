import { PartialType } from '@nestjs/mapped-types';
import { CreateColumnDto } from './create-column.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsOptional, MaxLength } from 'class-validator';

export class UpdateColumnDto extends PartialType(CreateColumnDto) {
  @ApiProperty()
  @IsAlphanumeric()
  @IsOptional()
  @MaxLength(100)
  name: string;
}
