import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DBConfig, JWTConfig } from './config';
import { GlobalModule } from './global/global.module';
import { CommentsModule } from './comments/comments.module';
import { CardsModule } from './cards/cards.module';
import { ColumnsModule } from './columns/columns.module';
import { BoardsModule } from './boards/boards.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DBConfig, JWTConfig],
    }),
    GlobalModule,
    UsersModule,
    BoardsModule,
    ColumnsModule,
    CardsModule,
    CommentsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
