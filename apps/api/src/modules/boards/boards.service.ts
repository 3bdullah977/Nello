import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { DB, DBType } from '@/modules/global/providers/db.provider';
import { board } from '@/_schemas/board';
import { eq, and } from 'drizzle-orm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { user, usersToBoards } from '@/_schemas/user';
import { UsersService } from '../users/users.service';

@Injectable()
export class BoardsService {
  constructor(
    @Inject(DB) private readonly db: DBType,
    private readonly cloudinaryService: CloudinaryService,
    private readonly usersService: UsersService,
  ) {}

  async create(createBoardDto: CreateBoardDto) {
    try {
      const res = await this.db
        .insert(board)
        .values(createBoardDto)
        .returning();
      return res[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot board user. ${error}`);
    }
  }

  async findAll(page: number, limit: number) {
    try {
      const offset = (page - 1) * limit;
      const res = await this.db
        .select()
        .from(board)
        .limit(limit)
        .offset(offset);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(`Cannot find boards. ${error}`);
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.db.select().from(board).where(eq(board.id, id));
      return res[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot retrieve board. ${error}`);
    }
  }

  async update(id: number, updateBoardDto: UpdateBoardDto) {
    try {
      const res = await this.db
        .update(board)
        .set(updateBoardDto)
        .where(eq(board.id, id))
        .returning();
      return res[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot update board. ${error}`);
    }
  }

  async remove(id: number) {
    try {
      const res = await this.db
        .delete(board)
        .where(eq(board.id, id))
        .returning();

      return res[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot remove board . ${error}`);
    }
  }

  async putCoverImage(file: Express.Multer.File, id: number) {
    try {
      const uploadedFile = await this.cloudinaryService.uploadImage(file);
      const modifiedBoard = await this.update(id, {
        imageUrl: (uploadedFile as any).url,
      });
      return modifiedBoard;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async addUserToBoard(userId: number, boardId: number) {
    const found = await this.db
      .select()
      .from(usersToBoards)
      .where(
        and(
          eq(usersToBoards.userId, userId),
          eq(usersToBoards.boardId, boardId),
        ),
      );
    if (found.length !== 0)
      throw new BadRequestException('User already in this board');

    await this.db.insert(usersToBoards).values({ userId, boardId });
    const updatedBoard = await this.db
      .select()
      .from(board)
      .leftJoin(usersToBoards, eq(board.id, usersToBoards.boardId))
      .leftJoin(user, eq(user.id, usersToBoards.userId))
      .where(eq(board.id, boardId));
    return updatedBoard;
  }

  async removeUserFromBoard(
    currentUserId: number,
    userId: number,
    boardId: number,
  ) {
    const isCreatorIdMatched = this.checkIfCreator(boardId, currentUserId);
    if (!isCreatorIdMatched)
      throw new UnauthorizedException('You are not the creator');

    const user = await this.usersService.findOne(userId);
    if (!user) throw new BadRequestException('User is not in this board');

    try {
      await this.db
        .delete(usersToBoards)
        .where(
          and(
            eq(usersToBoards.boardId, boardId),
            eq(usersToBoards.userId, userId),
          ),
        );
    } catch (error) {
      throw new InternalServerErrorException(
        `Cannot remove user from board. ${error}`,
      );
    }

    return user;
  }

  async toggleVisibility(currentUserId: number, boardId: number) {
    try {
      const isCreator = await this.checkIfCreator(boardId, currentUserId);
      if (!isCreator)
        throw new UnauthorizedException('You are not the creator');

      const boardToUpdate = await this.findOne(boardId);

      const updatedBoard = await this.db
        .update(board)
        .set({ isPrivate: !boardToUpdate.isPrivate })
        .where(eq(board.id, boardId))
        .returning();

      return updatedBoard[0];
    } catch (error) {
      throw new InternalServerErrorException(
        `Could not toggle visibility. ${error}`,
      );
    }
  }

  private async checkIfCreator(
    boardId: number,
    currentUserId: number,
  ): Promise<boolean> {
    const thisBoard = await this.findOne(boardId);
    return thisBoard.creatorId === currentUserId;
  }
}
