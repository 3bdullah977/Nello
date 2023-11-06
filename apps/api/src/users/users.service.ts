import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DB, DBType } from '@/global/providers/db.provider';
import { user } from '@/_schemas/user';
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/utils/password';
import LocalAuthGuard from '@/auth/guards/jwt.guard';

@Injectable()
export class UsersService {
  constructor(@Inject(DB) private readonly db: DBType) {}

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

  @UseGuards(LocalAuthGuard)
  async findAll(page: number, limit: number) {
    try {
      const offset = (page - 1) * limit;
      const res = await this.db.select().from(user).limit(limit).offset(offset);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(`Cannot find users. ${error}`);
    }
  }

  @UseGuards(LocalAuthGuard)
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

  @UseGuards(LocalAuthGuard)
  async findOne(id: number) {
    try {
      const res = await this.db.select().from(user).where(eq(user.id, id));
      return res[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot retrieve user. ${error}`);
    }
  }

  @UseGuards(LocalAuthGuard)
  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const res = await this.db
        .update(user)
        .set(updateUserDto)
        .where(eq(user.id, id))
        .returning();
      return res[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot update user. ${error}`);
    }
  }

  @UseGuards(LocalAuthGuard)
  async remove(id: number) {
    try {
      const res = await this.db.delete(user).where(eq(user.id, id)).returning();

      return res[0];
    } catch (error) {
      throw new InternalServerErrorException(`Cannot remove user. ${error}`);
    }
  }
}
