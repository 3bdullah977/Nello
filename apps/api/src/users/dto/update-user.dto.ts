import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ required: false })
  @IsAlphanumeric()
  @IsOptional()
  username: string;

  @ApiProperty({ required: false })
  @IsAlphanumeric()
  @IsOptional()
  password: string;

  @ApiProperty({ required: false })
  @IsAlphanumeric()
  @IsOptional()
  imageUrl: string;
}
