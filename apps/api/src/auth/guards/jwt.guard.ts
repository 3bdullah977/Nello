import { AuthGuard } from '@nestjs/passport';

export default class LocalAuthGuard extends AuthGuard('jwt') {}
