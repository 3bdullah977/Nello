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
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { QueryColumnDto } from '../columns/dto/query-column.dto';
import { ok } from '@/utils/response-helper';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import LocalAuthGuard from '../auth/guards/jwt.guard';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(LocalAuthGuard)
@Controller('/boards/:boardId/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Req() req: any,
    @Body() createDocumentDto: CreateDocumentDto,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    if (!createDocumentDto) throw new BadRequestException('Invalid Input');
    const document = await this.documentsService.create(
      req,
      createDocumentDto,
      boardId,
    );
    return ok('Created document successfully', document, true);
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
    const cards = await this.documentsService.findAll(page, limit, boardId);
    return ok('Found documents successfully', cards);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const document = await this.documentsService.findOne(id);
    if (!document) throw new NotFoundException('No document with such id');

    return ok('Found document successfully', document);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    await this.documentsService.findOne(id);

    return ok(
      'Updated card successfully',
      await this.documentsService.update(id, updateDocumentDto, req, boardId),
    );
  }

  @Delete(':id')
  async remove(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    const document = await this.documentsService.remove(id, req, boardId);

    return ok('Removed document successfully', document);
  }
}
