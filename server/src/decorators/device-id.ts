import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import type { Request } from 'express';

export const DeviceId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as Request;
    if (!request || !request.cookies['deviceId']) {
      throw new BadRequestException('Invalid deviceId!');
    }
    return request.cookies['deviceId'];
  },
);
