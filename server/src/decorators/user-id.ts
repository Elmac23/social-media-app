import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request || !request['userId']) {
      throw new Error('UserId not found in request');
    }
    return request['userId'];
  },
);
