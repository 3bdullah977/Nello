import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { comment } from '@/_schemas/comment';
import { DB, DBType } from '../global/providers/db.provider';
import { eq } from 'drizzle-orm';
import { card } from '@/_schemas/card';

@Injectable()
export class CommentsService {
  constructor(@Inject(DB) private readonly db: DBType) {}

  async create(createCommentDto: CreateCommentDto, cardId: number, req: any) {
    try {
      const newComment = await this.db
        .insert(comment)
        .values({ ...createCommentDto, cardId, userId: req.user.sub })
        .returning();

      return newComment[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot create comment. ${error}`);
    }
  }

  async findAll(page: number, limit: number, cardId: number) {
    const foundColumn = await this.db
      .select()
      .from(card)
      .where(eq(card.id, cardId));
    if (foundColumn.length <= 0)
      throw new NotFoundException('No card with such id');

    try {
      const offset = (page - 1) * limit;
      const comments = await this.db
        .select()
        .from(comment)
        .where(eq(comment.cardId, cardId))
        .limit(limit)
        .offset(offset);

      return comments;
    } catch (error) {
      throw new InternalServerErrorException(`Cannot find comments. ${error}`);
    }
  }

  async findOne(id: number) {
    try {
      const foundComment = await this.db
        .select()
        .from(comment)
        .where(eq(comment.id, id));

      return foundComment[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot find comment. ${error}`);
    }
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, req: any) {
    const isCreator = await this.isCreator(req.user.sub, id);
    if (!isCreator)
      throw new UnprocessableEntityException(
        'You are the creator of this comment',
      );

    try {
      const updatedComment = await this.db
        .update(comment)
        .set({ ...updateCommentDto, updatedAt: new Date() })
        .where(eq(comment.id, id))
        .returning();

      return updatedComment[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot update comment. ${error}`);
    }
  }

  async remove(id: number, req: any) {
    const isCreator = await this.isCreator(req.user.sub, id);
    if (!isCreator)
      throw new UnprocessableEntityException(
        'You are the creator of this comment',
      );

    try {
      const removedComment = await this.db
        .delete(comment)
        .where(eq(comment.id, id))
        .returning();

      return removedComment[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot remove comment. ${error}`);
    }
  }

  private async isCreator(userId: number, commentId: number) {
    const comment = await this.findOne(commentId);
    return comment.userId === userId;
  }
}
