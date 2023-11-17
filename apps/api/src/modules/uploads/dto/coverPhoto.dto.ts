import { ApiProperty } from '@nestjs/swagger';

export default class CoverPhotoDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  boardCover: string;
}
