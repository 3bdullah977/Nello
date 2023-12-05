import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  ParseIntPipe,
  BadRequestException,
  Query,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DrawingsService } from './drawings.service';
import { CreateDrawingDto } from './dto/create-drawing.dto';
import { UpdateDrawingDto } from './dto/update-drawing.dto';
import { ok } from '@/utils/response-helper';
import { QueryColumnDto } from '../columns/dto/query-column.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import LocalAuthGuard from '../auth/guards/jwt.guard';

@ApiTags('Drawings')
@ApiBearerAuth()
@UseGuards(LocalAuthGuard)
@Controller('/boards/:boardId/drawings')
export class DrawingsController {
  constructor(private readonly drawingsService: DrawingsService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body() createDrawingDto: CreateDrawingDto,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    if (!createDrawingDto) throw new BadRequestException('Invalid Input');
    const drawing = await this.drawingsService.create(
      createDrawingDto,
      boardId,
    );
    return ok('Created drawing successfully', drawing, true);
  }

  @Get()
  async findAll(
    @Query() query: QueryColumnDto,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    const page = query.page ?? 1;
    let limit = query.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }
    const cards = await this.drawingsService.findAll(page, limit, boardId);
    return ok('Found drawings successfully', cards);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const document = await this.drawingsService.findOne(id);
    if (!document) throw new NotFoundException('No drawing with such id');

    return ok('Found drawing successfully', document);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() updateDrawingDto: UpdateDrawingDto,
  ) {
    await this.drawingsService.findOne(id);

    return ok(
      'Updated drawing successfully',
      await this.drawingsService.update(id, updateDrawingDto, req, boardId),
    );
  }

  @Delete(':id')
  async remove(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    const document = await this.drawingsService.remove(id, req, boardId);

    return ok('Removed drawing successfully', document);
  }
}
