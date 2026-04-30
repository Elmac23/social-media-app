import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { QueryWithOrderedBy } from 'src/types/query';
import getResponse from 'src/utils/getResponse';
import { parseOrderBy } from 'src/utils/parseOrderBy';
import { PostLikesOrderByKeys } from '../post-likes/post-likes.schema';
import { PostRepostsOrderByKeys } from './post-reposts.schema';
import { parseUserWhere } from 'src/utils/parseUserWhere';

@Injectable()
export class PostRepostsService {
  constructor(private prismaService: PrismaService) {}

  async getReposts(
    postId: string,
    query: QueryWithOrderedBy<PostRepostsOrderByKeys> = {
      limit: 20,
      page: 1,
      search: '',
      orderBy: 'repostedAt-desc',
    },
  ) {
    const orderBy = parseOrderBy(query.orderBy, {
      repostedAt: (v) => {
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
    const data = await this.prismaService.sharedPost.findMany({
      where: {
        AND: [
          {
            postId,
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

    const count = await this.prismaService.sharedPost.count({
      where: { postId },
    });

    return getResponse(data, count);
  }

  async addRepost(postId: string, userId: string) {
    return this.prismaService.sharedPost.create({
      data: {
        postId,
        userId,
      },
    });
  }

  async deleteRepost(postId: string, userId: string) {
    await this.prismaService.sharedPost.delete({
      where: { postId_userId: { postId, userId } },
    });
    return {};
  }
}
