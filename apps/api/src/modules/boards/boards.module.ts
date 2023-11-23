import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [CloudinaryModule, UsersModule],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
