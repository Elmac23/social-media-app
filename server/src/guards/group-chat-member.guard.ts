import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class GroupChatMemberGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const userId = request.userId;
    const groupChatId = request.params.groupChatId;

    const membership = await this.prismaService.userInGroupChat.findFirst({
      where: {
        groupChatId: groupChatId,
        userId: userId,
      },
    });
    return !!membership;
  }
}
