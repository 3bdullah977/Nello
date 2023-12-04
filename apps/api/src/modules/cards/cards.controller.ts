import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  BadRequestException,
  Query,
  ParseIntPipe,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Put,
  Req,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import LocalAuthGuard from '../auth/guards/jwt.guard';
import { QueryColumnDto } from '../columns/dto/query-column.dto';
import { res, ok } from '@/utils/response-helper';
import { FileInterceptor } from '../uploads/file-interceptor';
import { imageFileFilter } from '@/utils/file-upload-util';
import { CardCoverDto } from './dto/card-cover.dto';
import { Request } from 'express';

@ApiTags('Cards')
@ApiBearerAuth()
@Controller('boards/:boardId/columns/:columnId/cards')
@UseGuards(LocalAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body() createCardDto: CreateCardDto,
    @Param('columnId', ParseIntPipe) columnId: number,
  ) {
    if (!createCardDto) throw new BadRequestException('Invalid Input');
    const card = await this.cardsService.create(createCardDto, columnId);
    return ok('Created card successfully', card, true);
  }

  @Get()
  async findAll(
    @Query() query: QueryColumnDto,
    @Param('columnId', ParseIntPipe) columnId: number,
  ) {
    const page = query.page ?? 1;
    let limit = query.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }
    const cards = await this.cardsService.findAll(page, limit, columnId);
    return ok('Found cards successfully', cards);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const card = await this.cardsService.findOne(id);
    if (!card) return res('No card with this id', HttpStatus.NOT_FOUND);

    return ok('Found card successfully', card);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    const card = await this.cardsService.findOne(id);
    if (!card) return res('No card with this id', HttpStatus.NOT_FOUND);

    return ok(
      'Updated card successfully',
      await this.cardsService.update(id, updateCardDto, req, boardId),
    );
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const card = await this.cardsService.remove(id);
    if (!card) return res('No card with this id', HttpStatus.NOT_FOUND);

    return ok('Removed card successfully', card);
  }

  @ApiConsumes('multipart/form-data')
  @Put(':cardId/uploadCover')
  @UseInterceptors(
    FileInterceptor('cardCover', { fileFilter: imageFileFilter }),
  )
  async uploadCover(
    @Req() req: Request,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() _input: CardCoverDto,
  ) {
    const updatedCard = await this.cardsService.putCoverImage(
      file,
      cardId,
      req,
      boardId,
    );
    return ok('Uploaded cover successfully', updatedCard.coverImage);
  }
}
