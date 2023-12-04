import { Module } from '@nestjs/common';
import { DrawingsService } from './drawings.service';
import { DrawingsController } from './drawings.controller';

@Module({
  controllers: [DrawingsController],
  providers: [DrawingsService],
})
export class DrawingsModule {}
