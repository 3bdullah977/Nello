import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DB, DBType } from '@/modules/global/providers/db.provider';
import { user } from '@/_schemas/user';
import { eq, like } from 'drizzle-orm';
import { hashPassword } from '@/utils/password';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DB) private readonly db: DBType,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const isInDB = await this.findByEmail(createUserDto.email);
      if (isInDB) throw new BadRequestException('User already exists');

      const hashed = hashPassword(createUserDto.password);
      const res = await this.db
        .insert(user)
        .values({ ...createUserDto, password: hashed })
        .returning();
      return res[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot create user. ${error}`);
    }
  }

  async findAll(page: number, limit: number) {
    try {
      const offset = (page - 1) * limit;
      const res = await this.db.select().from(user).limit(limit).offset(offset);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(`Cannot find users. ${error}`);
    }
  }

  async findByEmail(email: string) {
    try {
      const res = await this.db
        .select()
        .from(user)
        .where(eq(user.email, email));
      return res[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot retrieve user. ${error}`);
    }
  }

  async findByName(username: string) {
    try {
      const res = await this.db
        .select()
        .from(user)
        .where(like(user.username, `${username}%`));
      return res;
    } catch (error) {
      throw new InternalServerErrorException(`Cannot retrieve user. ${error}`);
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.db.select().from(user).where(eq(user.id, id));
      return res[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot retrieve user. ${error}`);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto, req: any) {
    const isSameId = req.user.sub === id;
    if (!isSameId)
      throw new UnprocessableEntityException('Cannot update this user');
    try {
      const res = await this.db
        .update(user)
        .set({ ...updateUserDto, updatedAt: new Date() })
        .where(eq(user.id, id))
        .returning();
      return res[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot update user. ${error}`);
    }
  }

  async remove(id: number) {
    try {
      const res = await this.db.delete(user).where(eq(user.id, id)).returning();

      return res[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot remove user. ${error}`);
    }
  }

  async putPersonalImage(file: Express.Multer.File, id: number, req: any) {
    const isSame = id === req.user.sub;
    if (!isSame) throw new BadRequestException('Wrong user');
    try {
      const uploadedFile = await this.cloudinaryService.uploadImage(
        file,
        'users_image',
      );
      const updatedUser = await this.update(
        id,
        {
          imageUrl: (uploadedFile as any).url,
        },
        req,
      );
      return updatedUser;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
