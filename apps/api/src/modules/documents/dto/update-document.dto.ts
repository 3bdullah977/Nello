import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDocumentDto } from './create-document.dto';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
  @ApiProperty()
  @IsString()
  @IsOptional()
  content: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  creatorId: number;
}
