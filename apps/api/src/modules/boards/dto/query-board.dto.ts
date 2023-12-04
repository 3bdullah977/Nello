import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryBoardDto {
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

  @ApiProperty({ required: false, type: 'boolean' })
  // @Transform(({ value }) => (value === 'true' ? true : false))
  @IsString({ groups: ['true', 'false'] })
  @IsOptional()
  withMembers: string;
}
