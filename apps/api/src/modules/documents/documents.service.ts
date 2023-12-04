import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DB, DBType } from '../global/providers/db.provider';
import { and, eq } from 'drizzle-orm';
import { board } from '@/_schemas/board';
import { document } from '@/_schemas/document';
import { usersToBoards } from '@/_schemas/user';

@Injectable()
export class DocumentsService {
  constructor(@Inject(DB) private readonly db: DBType) {}
  async create(createDocumentDto: CreateDocumentDto, boardId: number) {
    try {
      const newCard = await this.db
        .insert(document)
        .values({ ...createDocumentDto, boardId })
        .returning();

      return newCard[0];
    } catch (error) {
      throw new InternalServerErrorException(
        `Cannot create document. ${error}`,
      );
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
      const documents = await this.db
        .select()
        .from(document)
        .where(eq(document.boardId, boardId))
        .limit(limit)
        .offset(offset);

      return documents;
    } catch (error) {
      throw new InternalServerErrorException(`Cannot find documents. ${error}`);
    }
  }

  async findOne(id: number) {
    try {
      const foundDocument = await this.db
        .select()
        .from(document)
        .where(eq(document.id, id));

      return foundDocument[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot find document. ${error}`);
    }
  }

  async update(
    id: number,
    updateDocumentDto: UpdateDocumentDto,
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
        .update(document)
        .set({ ...updateDocumentDto, updatedAt: new Date() })
        .where(eq(document.id, id))
        .returning();

      return updatedDocument[0];
    } catch (error) {
      throw new InternalServerErrorException(
        `Cannot update document. ${error}`,
      );
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
      const removedDocument = await this.db
        .delete(document)
        .where(eq(document.id, id))
        .returning();

      return removedDocument[0];
    } catch (error) {
      throw new InternalServerErrorException(
        `Cannot remove document. ${error}`,
      );
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
