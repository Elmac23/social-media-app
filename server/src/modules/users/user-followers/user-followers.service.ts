import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { QueryWithOrderedBy } from 'src/types/query';
import getResponse from 'src/utils/getResponse';
import { UserOrderByKeys } from '../user.schema';
import { parseOrderBy } from 'src/utils/parseOrderBy';
import { parseUserWhere } from 'src/utils/parseUserWhere';

@Injectable()
export class UserFollowersService {
  constructor(private prismaService: PrismaService) {}
  async follow(followerId: string, followedId: string) {
    return await this.prismaService.followedUser.create({
      data: {
        followerId,
        followedId,
      },
    });
  }

  async getFollowers(
    userId: string,
    query: QueryWithOrderedBy<UserOrderByKeys> = {
      orderBy: 'id-desc',
      limit: 20,
      page: 1,
      search: '',
    },
  ) {
    const { orderBy, limit, page, search } = query;
    const orderByQuery = parseOrderBy(orderBy, {
      lastName: (v) => {
        return { lastname: v };
      },
    });

    const followedWhere = {
      followed: {
        some: {
          AND: [
            {
              followedId: userId,
              follower: parseUserWhere(search),
            },
          ],
        },
      },
    };
    const followingWhere = {
      followers: {
        some: {
          AND: [
            {
              followerId: userId,
              followed: parseUserWhere(search),
            },
          ],
        },
      },
    };
    const [followers, followersCount, following, followingCount] =
      await Promise.all([
        this.prismaService.user.findMany({
          where: {
            followed: {
              some: {
                AND: [
                  {
                    followedId: userId,
                    follower: parseUserWhere(search),
                  },
                ],
              },
            },
          },
          orderBy: orderByQuery,
          take: limit,
          skip: (page - 1) * query.limit,
          omit: { hashedPassword: true },
        }),
        this.prismaService.user.count({ where: followedWhere }),
        this.prismaService.user.findMany({
          where: followingWhere,
          take: limit,
          orderBy: orderByQuery,
          skip: (page - 1) * limit,
          omit: { hashedPassword: true },
        }),
        this.prismaService.user.count({ where: followingWhere }),
      ]);
    return {
      followers: getResponse(followers, followersCount),
      following: getResponse(following, followingCount),
    };
  }

  async unfollow(followerId: string, followedId: string) {
    await this.prismaService.followedUser.delete({
      where: { followerId_followedId: { followerId, followedId } },
    });
    return {};
  }
}
