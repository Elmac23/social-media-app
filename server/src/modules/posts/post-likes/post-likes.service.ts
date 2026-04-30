import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { QueryWithOrderedBy } from 'src/types/query';
import getResponse from 'src/utils/getResponse';
import { parseOrderBy } from 'src/utils/parseOrderBy';
import { PostLikesOrderByKeys } from './post-likes.schema';
import { parseUserWhere } from 'src/utils/parseUserWhere';

@Injectable()
export class PostLikesService {
  constructor(private prismaService: PrismaService) {}

  async getLikes(
    postId: string,
    query: QueryWithOrderedBy<PostLikesOrderByKeys> = {
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

    const data = await this.prismaService.like.findMany({
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

    const count = await this.prismaService.like.count({ where: { postId } });

    return getResponse(data, count);
  }

  async likePost(postId: string, userId: string) {
    return this.prismaService.like.create({
      data: {
        postId,
        userId,
      },
    });
  }

  async unlikePost(postId: string, userId: string) {
    await this.prismaService.like.deleteMany({
      where: {
        postId,
        userId,
      },
    });
    return {};
  }
}
