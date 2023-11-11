import { ApiProperty } from '@nestjs/swagger';

export default class SingleFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  photoUrl: string;
}
