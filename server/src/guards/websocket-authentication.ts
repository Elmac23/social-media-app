import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export class WebSocketAuthenticationGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToWs().getClient().handshake.auth;
    return request && request['userId'];
  }
}
