import { UsersService } from '@/users/users.service';
import { comparePasswords } from '@/utils/password';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import AuthLoginDto from './dto/auth-login.dto';
import { LoginReturnType } from './types/login-return.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateLogin({
    email,
    password,
  }: AuthLoginDto): Promise<LoginReturnType> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('Could not find user');

    const isPasswordValid = comparePasswords(user.password, password);
    if (user && isPasswordValid) {
      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        username: user.username,
      });

      return { user, token };
    }
    throw new BadRequestException('Password is incorrect');
  }
}
