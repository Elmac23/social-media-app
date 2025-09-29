import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class CommentLikesService {
  constructor(private prismaService: PrismaService) {}

  async getLikes(commentId: string) {
    return await this.prismaService.commentLike.findMany({
      where: { commentId },
      include: {
        user: {
          omit: { hashedPassword: true },
        },
      },
    });
  }

  async likeComment(commentId: string, userId: string) {
    return await this.prismaService.commentLike.create({
      data: {
        commentId,
        userId,
      },
    });
  }

  async unlikeComment(commentId: string, userId: string) {
    await this.prismaService.commentLike.delete({
      where: {
        userId_commentId: { userId, commentId },
      },
    });
    return {};
  }
}
