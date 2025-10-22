import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { unzipCountFields } from 'src/utils/unzip-count-fields';
import { Comment } from 'generated/prisma';
@Injectable()
export class PostCommentsService {
  constructor(private prismaService: PrismaService) {}

  async processLikedStatus<T>(comment: T, userId?: string) {
    if (!userId) return comment;
    const likeReltion = await this.prismaService.commentLike.findUnique({
      where: {
        userId_commentId: {
          commentId: (comment as Comment).id,
          userId,
        },
      },
    });
    return {
      ...(comment as T),
      isLikedByMe: !!likeReltion,
    };
  }

  async getCommentsByPost(postId: string, userId?: string) {
    const comments = await this.prismaService.comment.findMany({
      where: { postId, parentCommentId: null },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { likes: true, subComments: true },
        },
        author: {
          omit: { hashedPassword: true },
        },
      },
    });

    const mappedComments = comments.map((c) =>
      unzipCountFields(c, ['likes', 'subComments']),
    );

    return Promise.all(
      mappedComments.map((c) => this.processLikedStatus(c, userId)),
    );
  }
}
