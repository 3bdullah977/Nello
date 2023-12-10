import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { DB, DBType } from '@/modules/global/providers/db.provider';
import { Board, board } from '@/_schemas/board';
import { eq, and, sql, like } from 'drizzle-orm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { User, user, usersToBoards } from '@/_schemas/user';
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

  async findAll(page: number, limit: number, withMembers: boolean, req: any) {
    try {
      const currentUserId = req.user.sub;
      const offset = (page - 1) * limit;

      type Res = { board: Board; members: User[] };

      let result: Board[] | Res[];

      if (withMembers) {
        result = (await this.db.execute(
          sql<{
            board: Board;
          }>`  select  distinct b.* 
          from board b
          left join users_to_boards utb 
          on b.id = utb.board_id
          left join public.user u
          on utb.user_id = u.id
          where (b.is_private = true) and (utb.user_id = ${currentUserId} or b.creator_id = ${currentUserId})
          or b.is_private = false
          limit ${limit} offset ${offset}`,
        )) as Board[];
        console.log(result);
      } else {
        result = (await this.db.execute(
          sql<{
            board: Board;
          }>`  select  distinct b.* 
          from board b
          left join users_to_boards utb 
          on b.id = utb.board_id
          left join public.user u
          on utb.user_id = u.id
          where (b.is_private = true) and (utb.user_id = ${currentUserId} or b.creator_id = ${currentUserId})
          or b.is_private = false
          limit ${limit} offset ${offset}`,
        )) as Board[];
        console.log(result);
      }

      result.forEach((a) => {
        Object.keys(a).forEach((k) => {
          console.log(a);
          const newK = k.replace(/(\_\w)/g, (m) => m[1].toUpperCase());
          if (newK != k) {
            a[newK] = a[k];
            delete a[k];
          }
        });
      });
      return result;
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

  async findByName(boardName: string) {
    try {
      const res = await this.db
        .select()
        .from(board)
        .where(like(board.name, `${boardName}%`));
      return res;
    } catch (error) {
      throw new InternalServerErrorException(`Cannot retrieve board. ${error}`);
    }
  }

  async update(id: number, updateBoardDto: UpdateBoardDto, req: any) {
    const foundBoard = await this.findOne(id);
    if (!foundBoard) throw new BadRequestException('Board not found');
    const isSameId = req.user.sub === foundBoard.creatorId;
    console.log(isSameId);
    if (!isSameId)
      throw new UnprocessableEntityException('You are not the creator');
    try {
      const res = await this.db
        .update(board)
        .set({ ...updateBoardDto, updatedAt: new Date() })
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

  async putCoverImage(file: Express.Multer.File, id: number, req: any) {
    const isCreator = await this.checkIfCreator(id, req.user.sub);
    console.log(!isCreator);
    if (!isCreator) throw new BadRequestException('You are not the creator');
    try {
      const uploadedFile = await this.cloudinaryService.uploadImage(
        file,
        'boards_cover',
      );
      const modifiedBoard = await this.update(
        id,
        {
          imageUrl: (uploadedFile as any).url,
        },
        req,
      );
      return modifiedBoard;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async addUserToBoard(userId: number, boardId: number) {
    const isCreator = await this.checkIfCreator(boardId, userId);
    if (isCreator) throw new BadRequestException('This user is the creator');

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

  async listBoardMembers(boardId: number, currentUserId: number) {
    const thisBoard = await this.db
      .select()
      .from(board)
      .where(eq(board.id, boardId));
    if (thisBoard.length === 0)
      throw new NotFoundException('Board does not exist');
    const boardMembers = await this.db
      .select()
      .from(user)
      .leftJoin(usersToBoards, eq(user.id, usersToBoards.userId))
      .leftJoin(board, eq(board.id, usersToBoards.boardId))
      .where(eq(board.id, boardId));

    const result = boardMembers.map((item) => item.user);

    const isCreator = await this.checkIfCreator(boardId, currentUserId);
    if (isCreator) {
      const creator = await this.db
        .select()
        .from(user)
        .where(eq(user.id, currentUserId));
      result.push(creator[0]);
    }
    return result;
  }

  async removeUserFromBoard(
    currentUserId: number,
    userId: number,
    boardId: number,
  ) {
    try {
      const user = await this.usersService.findOne(userId);
      if (!user) throw new BadRequestException('Could not find this user');

      const isCreatorIdMatched = this.checkIfCreator(boardId, currentUserId);
      if (!isCreatorIdMatched)
        throw new UnauthorizedException('You are not the creator');

      if (userId === (await this.findOne(boardId)).creatorId)
        throw new BadRequestException('Cannot remove the creator');

      const isUserInBoard = await this.isInBoardMembers(userId, boardId);
      if (isUserInBoard.length === 0)
        throw new BadRequestException('User is not in this board');
    } catch (e) {
      throw e;
    }

    try {
      console.log(
        await this.db
          .delete(usersToBoards)
          .where(
            and(
              eq(usersToBoards.boardId, boardId),
              eq(usersToBoards.userId, userId),
            ),
          )
          .returning(),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Cannot remove user from board. ${error}`,
      );
    }

    return { user, boardId };
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
    if (!thisBoard) throw new NotFoundException('Cannot find board');
    return thisBoard.creatorId === currentUserId;
  }

  private async isInBoardMembers(userId: number, boardId: number) {
    const found = await this.db
      .select()
      .from(usersToBoards)
      .where(
        and(
          eq(usersToBoards.userId, userId),
          eq(usersToBoards.boardId, boardId),
        ),
      );
    return found;
  }
}
