import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryConfig, DBConfig, JWTConfig } from './config';
import { GlobalModule } from './modules/global/global.module';
import { CommentsModule } from './modules/comments/comments.module';
import { CardsModule } from './modules/cards/cards.module';
import { ColumnsModule } from './modules/columns/columns.module';
import { BoardsModule } from './modules/boards/boards.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { DocumentsModule } from './modules/documents/documents.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DBConfig, JWTConfig, CloudinaryConfig],
    }),
    GlobalModule,
    UsersModule,
    BoardsModule,
    ColumnsModule,
    CardsModule,
    CommentsModule,
    AuthModule,
    UploadsModule,
    CloudinaryModule,
    DocumentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
