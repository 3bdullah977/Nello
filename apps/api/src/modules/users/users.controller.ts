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
  HttpStatus,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryUserDto } from './dto/query-user.dto';
import { ok, res } from '@/utils/reponse-helper';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    return ok(
      'Created user successfully',
      await this.usersService.create(createUserDto),
      true
    );
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Req() req, @Query() query: QueryUserDto) {
    console.log(req)
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const users = await this.usersService.findAll(page, limit);

    return ok('Found users successfully', { users });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) return res('No user with this id', HttpStatus.NOT_FOUND);

    return ok('Found user successfully', user);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.findOne(id);
    if (!user) return res('No user with this id', HttpStatus.NOT_FOUND);

    return ok(
      'Updated user successfully',
      await this.usersService.update(id, updateUserDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) return res('No user with this id', HttpStatus.NOT_FOUND);

    return ok('Removed user successfully', await this.usersService.remove(id));
  }
}
