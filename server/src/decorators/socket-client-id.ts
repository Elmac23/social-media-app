import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const SocketClientId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToWs().getClient().handshake.auth;
    if (!request || !request['userId']) {
      throw new Error('UserId not found in socket');
    }
    return request['userId'];
  },
);
