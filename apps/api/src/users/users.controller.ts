import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { QueryUserDto } from './dto/query-user.dto';
import { ok } from '@/utils/reponse-helper';

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return ok(
      'Created user successfully',
      await this.usersService.create(createUserDto),
    );
  }

  @Get()
  async findAll(@Query() query: QueryUserDto) {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    console.log(page, limit);

    const users = await this.usersService.findAll(page, limit);

    return ok('Found users successfully', { users });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return ok('Found user successfully', await this.usersService.findOne(id));
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return ok(
      'Updated user successfully',
      await this.usersService.update(id, updateUserDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return ok('Removed user successfully', await this.usersService.remove(id));
  }
}
