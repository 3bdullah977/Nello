import { ApiProperty } from '@nestjs/swagger';

export class CardCoverDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  cardCover: string;
}
