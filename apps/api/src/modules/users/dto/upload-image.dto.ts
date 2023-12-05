import { ApiProperty } from '@nestjs/swagger';

export default class PersonalImageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  personalImage: string;
}
