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
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { ok, res } from '@/utils/response-helper';
import { QueryColumnDto } from './dto/query-column.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import LocalAuthGuard from '../auth/guards/jwt.guard';

@ApiTags('Columns')
@ApiBearerAuth()
@Controller('columns')
@UseGuards(LocalAuthGuard)
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createColumnDto: CreateColumnDto) {
    if (!createColumnDto) return null;
    const column = await this.columnsService.create(createColumnDto);
    return ok('Created column successfully', column, true);
  }

  @Get()
  async findAll(@Query() query: QueryColumnDto) {
    const page = query.page ?? 1;
    let limit = query.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }
    const columns = await this.columnsService.findAll(page, limit);
    return ok('Found columns successfully', columns);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const column = await this.columnsService.findOne(id);
    if (!column) return res('No column with this id', HttpStatus.NOT_FOUND);

    return ok('Found column successfully', column);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateColumnDto: UpdateColumnDto,
  ) {
    const column = await this.columnsService.findOne(id);
    if (!column) return res('No column with this id', HttpStatus.NOT_FOUND);

    return ok(
      'Updated column successfully',
      await this.columnsService.update(id, updateColumnDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const column = await this.columnsService.remove(id);
    if (!column) return res('No column with this id', HttpStatus.NOT_FOUND);

    return ok('Removed column successfully', column);
  }
}
