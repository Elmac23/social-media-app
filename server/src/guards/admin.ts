import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const userId = request.userId;
    const paramId = request.params.id;

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) return false;

    return user.role === 'ADMIN';
  }
}
