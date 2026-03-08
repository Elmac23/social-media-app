import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { unzipCountFields } from 'src/utils/unzip-count-fields';
import { Comment } from 'generated/prisma';
import getResponse from 'src/utils/getResponse';
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
    const where = { postId, parentCommentId: null };
    const [comments, count] = await Promise.all([
      this.prismaService.comment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { likes: true, subComments: true },
          },
          author: {
            omit: { hashedPassword: true },
          },
        },
      }),
      this.prismaService.comment.count({ where }),
    ]);

    const mappedComments = comments.map((c) =>
      unzipCountFields(c, ['likes', 'subComments']),
    );

    const result = await Promise.all(
      mappedComments.map((c) => this.processLikedStatus(c, userId)),
    );

    return getResponse(result, count);
  }
}
