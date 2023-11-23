import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  Req,
  Put,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { QueryBoardDto } from './dto/query-board.dto';
import { Board } from '@/_schemas/board';
import { ok, res } from '@/utils/reponse-helper';
import LocalAuthGuard from '@/modules/auth/guards/jwt.guard';
import { FileInterceptor } from '../uploads/file-interceptor';
import { imageFileFilter } from '@/utils/file-upload-util';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import CoverPhotoDto from '../uploads/dto/coverPhoto.dto';
import { AddUserBoardDto } from './dto/add-user-board.dto';
import { User } from '@/_schemas/user';

@ApiTags('Boards')
@ApiBearerAuth()
@UseGuards(LocalAuthGuard)
@Controller({ path: 'boards', version: '1' })
export class BoardsController {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createBoardDto: CreateBoardDto) {
    if (!createBoardDto) return null;
    const board = await this.boardsService.create(createBoardDto);
    return ok<Board>('Created board successfully', board, true);
  }

  @Get()
  async findAll(@Query() query: QueryBoardDto) {
    const page = query.page ?? 1;
    let limit = query.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }
    const boards = await this.boardsService.findAll(page, limit);
    return ok<Board[]>('Found boards successfully', boards);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const board = await this.boardsService.findOne(id);
    if (!board) return res('No board with this id', HttpStatus.NOT_FOUND);

    return ok<Board>('Found board successfully', board);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    const board = await this.boardsService.findOne(id);
    if (!board) return res('No board with this id', HttpStatus.NOT_FOUND);

    return ok<Board>(
      'Updated board successfully',
      await this.boardsService.update(id, updateBoardDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const board = await this.boardsService.remove(id);
    if (!board) return res('No board with this id', HttpStatus.NOT_FOUND);

    return ok<Board>('Removed board successfully', board);
  }

  @ApiConsumes('multipart/form-data')
  @Post('/uploadCover')
  @UseInterceptors(
    FileInterceptor('boardCover', { fileFilter: imageFileFilter }),
  )
  async uploadCover(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body() _input: CoverPhotoDto,
  ) {
    const uploadedCover = await this.cloudinaryService.uploadImage(file);
    return ok('Cover uploaded successfully', {
      photoUrl: (uploadedCover as any).url,
    });
  }

  @Put('/addUserToBoard/:boardId')
  async addUserToBoard(
    @Body() addUserBoardDto: AddUserBoardDto,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    const { userId } = addUserBoardDto;
    let result: { board: Board; users: User[] };
    const updatedBoardWithUsers = await this.boardsService.addUserToBoard(
      userId,
      boardId,
    );

    result.board = updatedBoardWithUsers[0]?.board;
    result.users = updatedBoardWithUsers.map((ele) => {
      const { user } = ele;
      return user;
    });

    return ok('Added user to board successfully', {
      boardWithUsers: result,
    });
  }

  @Delete('/removeUserFromBoard/:boardId')
  async removeUserFromBoard(
    @Req() req,
    @Body() input: AddUserBoardDto,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    const { userId } = input;
    const removedUser = await this.boardsService.removeUserFromBoard(
      req.user.sub,
      userId,
      boardId,
    );
    return ok('Removed user from board successfully', removedUser);
  }
}
