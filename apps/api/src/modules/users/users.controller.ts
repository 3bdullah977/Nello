import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
  Req,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { QueryUserDto } from './dto/query-user.dto';
import { ok, res } from '@/utils/response-helper';
import { AuthGuard } from '@nestjs/passport';
import PersonalImageDto from './dto/upload-image.dto';
import { imageFileFilter } from '@/utils/file-upload-util';
import { FileInterceptor } from '../uploads/file-interceptor';

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    return ok(
      'Created user successfully',
      await this.usersService.create(createUserDto),
      true,
    );
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Req() req, @Query() query: QueryUserDto) {
    console.log(req);
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const users = await this.usersService.findAll(page, limit);

    return ok('Found users successfully', { users });
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) return res('No user with this id', HttpStatus.NOT_FOUND);

    return ok('Found user successfully', user);
  }

  @Get(':username/findByName')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async findByName(@Param('username') username: string) {
    const user = await this.usersService.findByName(username);
    if (!user) return res('No user with this name', HttpStatus.NOT_FOUND);

    return ok('Found user successfully', user);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    const user = await this.usersService.findOne(id);
    if (!user) return res('No user with this id', HttpStatus.NOT_FOUND);

    const updatedUser = await this.usersService.update(id, updateUserDto, req);

    return ok('Updated user successfully', updatedUser);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put('/uploadCover')
  @UseInterceptors(
    FileInterceptor('personalImage', { fileFilter: imageFileFilter }),
  )
  async uploadCover(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() _input: PersonalImageDto,
  ) {
    const updatedBoard = await this.usersService.putPersonalImage(
      file,
      req.user.sub,
      req,
    );
    return ok('Personal image uploaded successfully', {
      photoUrl: updatedBoard.imageUrl,
    });
  }

  // @Delete(':id')
  // async remove(@Param('id', ParseIntPipe) id: number) {
  //   const user = await this.usersService.findOne(id);
  //   if (!user) return res('No user with this id', HttpStatus.NOT_FOUND);

  //   return ok('Removed user successfully', await this.usersService.remove(id));
  // }
}
