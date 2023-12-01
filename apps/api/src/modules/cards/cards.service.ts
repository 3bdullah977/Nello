import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { card } from '@/_schemas/card';
import { DB, DBType } from '../global/providers/db.provider';
import { and, eq } from 'drizzle-orm';
import { column } from '@/_schemas/column';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { board } from '@/_schemas/board';
import { usersToBoards } from '@/_schemas/user';

@Injectable()
export class CardsService {
  constructor(
    @Inject(DB) private readonly db: DBType,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createCardDto: CreateCardDto, columnId: number) {
    try {
      const newCard = await this.db
        .insert(card)
        .values({ ...createCardDto, columnId })
        .returning();

      return newCard[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot create card. ${error}`);
    }
  }

  async findAll(page: number, limit: number, columnId: number) {
    const foundColumn = await this.db
      .select()
      .from(column)
      .where(eq(column.id, columnId));
    if (foundColumn.length <= 0)
      throw new NotFoundException('No column with such id');

    try {
      const offset = (page - 1) * limit;
      const cards = await this.db
        .select()
        .from(card)
        .where(eq(card.columnId, columnId))
        .limit(limit)
        .offset(offset);

      return cards;
    } catch (error) {
      throw new InternalServerErrorException(`Cannot find cards. ${error}`);
    }
  }

  async findOne(id: number) {
    try {
      const foundCard = await this.db
        .select()
        .from(card)
        .where(eq(card.id, id));

      return foundCard[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot find card. ${error}`);
    }
  }

  async update(id: number, updateCardDto: UpdateCardDto, req: any) {
    if (updateCardDto.columnId) {
      const toMoveColumn = await this.db
        .select()
        .from(column)
        .where(eq(column.id, updateCardDto.columnId));

      if (toMoveColumn.length === 0)
        throw new NotFoundException('Column does not exist');
    }

    const found = await this.isInBoardMembers(req.user.sub, id);

    const boardCreator = await this.db
      .select()
      .from(board)
      .where(eq(board.creatorId, req.user.sub));

    if (found.length === 0 && boardCreator.length === 0)
      throw new UnprocessableEntityException(
        'You are not a member of this board',
      );
    try {
      const updatedCard = await this.db
        .update(card)
        .set(updateCardDto)
        .where(eq(card.id, id))
        .returning();

      return updatedCard[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot update card. ${error}`);
    }
  }

  async remove(id: number) {
    try {
      const removedCard = await this.db
        .delete(card)
        .where(eq(card.id, id))
        .returning();

      return removedCard[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot remove card. ${error}`);
    }
  }

  async putCoverImage(file: Express.Multer.File, id: number, req: any) {
    try {
      const uploadedFile = await this.cloudinaryService.uploadImage(
        file,
        'cards_cover',
      );
      const modifiedBoard = await this.update(
        id,
        {
          coverImage: (uploadedFile as any).url,
        },
        req,
      );
      return modifiedBoard;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  private async isInBoardMembers(userId: number, cardId: number) {
    const colCardBoard = await this.db
      .select()
      .from(board)
      .leftJoin(column, eq(board.id, column.boardId))
      .leftJoin(card, eq(card.columnId, column.id))
      .where(eq(card.id, cardId));

    const found = await this.db
      .select()
      .from(usersToBoards)
      .where(
        and(
          eq(usersToBoards.userId, userId),
          eq(usersToBoards.boardId, colCardBoard[0].board.id),
        ),
      );
    return found;
  }
}
