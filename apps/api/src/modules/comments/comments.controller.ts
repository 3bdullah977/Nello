import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
  ParseIntPipe,
  BadRequestException,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { QueryColumnDto } from '../columns/dto/query-column.dto';
import { ok } from '@/utils/response-helper';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import LocalAuthGuard from '../auth/guards/jwt.guard';

@ApiTags('Comments')
@UseGuards(LocalAuthGuard)
@ApiBearerAuth()
@Controller('boards/:boardId/columns/:columnId/cards/:cardId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Req() req: Request,
  ) {
    if (!createCommentDto) throw new BadRequestException('Invalid Input');
    const comment = await this.commentsService.create(
      createCommentDto,
      cardId,
      req,
    );
    return ok('Created comment successfully', comment, true);
  }

  @Get()
  async findAll(
    @Query() query: QueryColumnDto,
    @Param('cardId', ParseIntPipe) cardId: number,
  ) {
    const page = query.page ?? 1;
    let limit = query.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }
    const comments = await this.commentsService.findAll(page, limit, cardId);
    return ok('Found comments successfully', comments);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const comment = await this.commentsService.findOne(id);
    if (!comment) throw new NotFoundException('No comment with such id');

    return ok('Found comment successfully', comment);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request,
  ) {
    const comment = await this.commentsService.findOne(id);
    if (!comment) new NotFoundException('No comment with such id');

    return ok(
      'Updated card successfully',
      await this.commentsService.update(id, updateCommentDto, req),
    );
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const comment = await this.commentsService.remove(id, req);
    if (!comment) new NotFoundException('No comment with such id');

    return ok('Removed comment successfully', comment);
  }
}
