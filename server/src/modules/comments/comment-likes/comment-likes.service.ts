import { Injectable } from '@nestjs/common';
import { PostLikesOrderByKeys } from 'src/modules/posts/post-likes/post-likes.schema';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { QueryWithOrderedBy } from 'src/types/query';
import getResponse from 'src/utils/getResponse';
import { parseOrderBy } from 'src/utils/parseOrderBy';
import { parseUserWhere } from 'src/utils/parseUserWhere';
import { CommentLikesOrderByKeys } from './comment-likes.schema';

@Injectable()
export class CommentLikesService {
  constructor(private prismaService: PrismaService) {}

  async getLikes(
    commentId: string,
    query: QueryWithOrderedBy<CommentLikesOrderByKeys> = {
      limit: 20,
      page: 1,
      search: '',
      orderBy: 'likedAt-asc',
    },
  ) {
    const orderBy = parseOrderBy(query.orderBy, {
      likedAt: (v) => {
        return {
          createdAt: v,
        };
      },
      user: (v) => {
        return {
          user: {
            login: v,
          },
        };
      },
    });

    const data = await this.prismaService.commentLike.findMany({
      where: {
        AND: [
          {
            commentId,
          },
          {
            user: parseUserWhere(query.search),
          },
        ],
      },
      orderBy,
      take: query.limit,
      skip: (query.page - 1) * query.limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            login: true,
            lastname: true,
            avatarUrl: true,
          },
        },
      },
    });

    const count = await this.prismaService.commentLike.count({
      where: { commentId },
    });

    return getResponse(data, count);
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
