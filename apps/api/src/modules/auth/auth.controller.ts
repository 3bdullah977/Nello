import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthLoginDto from './dto/auth-login.dto';
import { ApiTags } from '@nestjs/swagger';
import { ok } from '@/utils/response-helper';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthLoginDto) {
    return ok(
      'Logged user successfully',
      await this.authService.validateLogin(loginDto),
    );
  }
}
