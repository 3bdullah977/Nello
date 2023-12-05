import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateDrawingDto } from './dto/create-drawing.dto';
import { UpdateDrawingDto } from './dto/update-drawing.dto';
import { DB, DBType } from '../global/providers/db.provider';
import { drawing } from '@/_schemas/drawing';
import { board } from '@/_schemas/board';
import { and, eq } from 'drizzle-orm';
import { usersToBoards } from '@/_schemas/user';

@Injectable()
export class DrawingsService {
  constructor(@Inject(DB) private readonly db: DBType) {}
  async create(createDrawingDto: CreateDrawingDto, boardId: number) {
    try {
      const newCard = await this.db
        .insert(drawing)
        .values({ ...createDrawingDto, boardId })
        .returning();

      return newCard[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot create drawing. ${error}`);
    }
  }

  async findAll(page: number, limit: number, boardId: number) {
    const foundBoard = await this.db
      .select()
      .from(board)
      .where(eq(board.id, boardId));
    if (foundBoard.length <= 0)
      throw new NotFoundException('No board with such id');

    try {
      const offset = (page - 1) * limit;
      const drawings = await this.db
        .select()
        .from(drawing)
        .where(eq(drawing.boardId, boardId))
        .limit(limit)
        .offset(offset);

      return drawings;
    } catch (error) {
      throw new InternalServerErrorException(`Cannot find drawings. ${error}`);
    }
  }

  async findOne(id: number) {
    try {
      const foundDrawing = await this.db
        .select()
        .from(drawing)
        .where(eq(drawing.id, id));

      return foundDrawing[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot find drawing. ${error}`);
    }
  }

  async update(
    id: number,
    updateDrawingDto: UpdateDrawingDto,
    req: any,
    boardId: number,
  ) {
    const found = await this.isInBoardMembers(req.user.sub, boardId);

    const boardCreator = await this.db
      .select()
      .from(board)
      .where(eq(board.creatorId, req.user.sub));

    if (found.length === 0 && boardCreator.length === 0)
      throw new UnprocessableEntityException(
        'You are not a member of this board',
      );
    try {
      const updatedDocument = await this.db
        .update(drawing)
        .set({ ...updateDrawingDto, updatedAt: new Date() })
        .where(eq(drawing.id, id))
        .returning();

      return updatedDocument[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot update drawing. ${error}`);
    }
  }

  async remove(id: number, req: any, boardId: number) {
    const found = await this.isInBoardMembers(req.user.sub, boardId);

    const boardCreator = await this.db
      .select()
      .from(board)
      .where(eq(board.creatorId, req.user.sub));

    if (found.length === 0 && boardCreator.length === 0)
      throw new UnprocessableEntityException(
        'You are not a member of this board',
      );
    try {
      const removedDrawing = await this.db
        .delete(drawing)
        .where(eq(drawing.id, id))
        .returning();

      return removedDrawing[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot remove drawing. ${error}`);
    }
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
