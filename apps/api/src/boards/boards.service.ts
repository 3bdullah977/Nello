import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { DB, DBType } from '@/global/providers/db.provider';
import { Board, board } from '@/_schemas/board';
import { ok } from '@/utils/reponse-helper';
import { eq } from 'drizzle-orm';

@Injectable()
export class BoardsService {
  constructor(@Inject(DB) private readonly db: DBType) {}

  async create(createBoardDto: CreateBoardDto) {
    try {
      const res = await this.db
        .insert(board)
        .values(createBoardDto)
        .returning();
      return ok<Board>('Created board successfully', res[0]);
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
      return ok<Board[]>('Found Boards successfully', res);
    } catch (error) {
      throw new InternalServerErrorException(`Cannot find boards. ${error}`);
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.db.select().from(board).where(eq(board.id, id));
      return ok<Board>('Found board successfully', res[0]);
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
      return ok<Board>('Updated board successfully', res[0]);
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

      return ok<Board>('Removed board successfully', res[0]);
    } catch (error) {
      throw new InternalServerErrorException(`Cannot remove board . ${error}`);
    }
  }
}
