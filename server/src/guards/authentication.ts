import {
  CanActivate,
  ExecutionContext,
  Global,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { tryOrUndefined } from 'src/utils/try-or-undefined';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const bearerToken = request.headers['authorization'];

    if (!bearerToken) return false;

    const token = bearerToken.split(' ')[1];

    if (!token) return false;

    const payload = await tryOrUndefined(this.jwtService.verifyAsync(token));

    if (!payload) return false;

    request.userId = payload.id;

    return true;
  }
}
