import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { card } from '@/_schemas/card';
import { DB, DBType } from '../global/providers/db.provider';
import { eq } from 'drizzle-orm';
import { column } from '@/_schemas/column';

@Injectable()
export class CardsService {
  constructor(@Inject(DB) private readonly db: DBType) {}

  async create(createCardDto: CreateCardDto) {
    try {
      const newCard = await this.db
        .insert(card)
        .values(createCardDto)
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

  async update(id: number, updateCardDto: UpdateCardDto) {
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
}
