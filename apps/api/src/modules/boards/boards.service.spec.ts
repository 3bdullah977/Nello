import { Test, TestingModule } from '@nestjs/testing';
import { BoardsService } from './boards.service';
import { Board } from '@/_schemas/board';
import { DBProvider } from '../global/providers/db.provider';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

describe('BoardsService', () => {
  let service: BoardsService;
  let newBoard: Board;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CloudinaryModule],
      providers: [BoardsService, DBProvider],
    }).compile();

    service = module.get<BoardsService>(BoardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new board', async () => {
    newBoard = await service.create({
      creatorId: 1,
      name: 'New Board',
      imageUrl: '',
      isPrivate: false,
    });

    expect(newBoard).toBeDefined();
  });

  it('should return all boards', async () => {
    const boards = await service.findAll(NaN, NaN);

    expect(boards).toBeDefined();
  });

  it('should add user to board', async () => {
    const updatedBoard = await service.addUserToBoard(1, newBoard.id);

    expect(updatedBoard).toBeDefined();
  });
});
