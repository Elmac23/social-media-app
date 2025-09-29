import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class ForbidSelfRepostGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const userId = request.userId;
    const postId = request.params.postId;

    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
    });

    if (!post) return false;

    if (post.authorId === userId) return false;

    return true;
  }
}
