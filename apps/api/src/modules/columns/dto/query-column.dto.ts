import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class QueryColumnDto {
  @ApiProperty({ required: false })
  @Transform(({ value }) => (value ? parseInt(value) : 1))
  @IsOptional()
  @IsNumber()
  page: number;

  @ApiProperty({ required: false })
  @Transform(({ value }) => (value ? parseInt(value) : 1))
  @IsNumber()
  @IsOptional()
  limit: number;
}
