import { Injectable, Search } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { unzipCountFields } from 'src/utils/unzip-count-fields';
import { Comment } from 'generated/prisma';
import getResponse from 'src/utils/getResponse';
import { QueryWithOrderedBy } from 'src/types/query';
import { CommentOrderByKeys } from 'src/modules/comments/comments.schema';
import { parseOrderBy } from 'src/utils/parseOrderBy';
import { parseUserWhere } from 'src/utils/parseUserWhere';
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

  async getCommentsByPost(
    postId: string,
    userId?: string,
    query: QueryWithOrderedBy<CommentOrderByKeys> = {
      limit: 20,
      orderBy: 'createdAt-desc',
      page: 1,
    },
  ) {
    const orderByResult = parseOrderBy(query.orderBy, {
      author: (v) => {
        return {
          author: {
            login: v,
          },
        };
      },
      likes: (v) => {
        return {
          likes: {
            _count: v,
          },
        };
      },

      responses: (v) => {
        return {
          subComments: {
            _count: v,
          },
        };
      },
    });
    const where = {
      AND: [
        {
          postId,
          parentCommentId: null,
        },
        {
          author: parseUserWhere(query.search),
        },
      ],
    };
    const [comments, count] = await Promise.all([
      this.prismaService.comment.findMany({
        where,
        orderBy: orderByResult,
        take: query.limit,
        skip: (query.page - 1) * query.limit,
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
