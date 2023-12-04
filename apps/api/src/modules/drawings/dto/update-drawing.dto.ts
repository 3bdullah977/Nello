import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDrawingDto } from './create-drawing.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateDrawingDto extends PartialType(CreateDrawingDto) {
  @ApiProperty()
  @IsString()
  @IsOptional()
  content: string;
}
