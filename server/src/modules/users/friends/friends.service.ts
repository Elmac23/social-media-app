import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { QueryType, QueryWithOrderedBy } from 'src/types/query';
import getResponse from 'src/utils/getResponse';
import { UserOrderByKeys } from '../user.schema';
import { parseOrderBy } from 'src/utils/parseOrderBy';

@Injectable()
export class FriendsService {
  constructor(private prismaService: PrismaService) {}

  async deleteFriend(userId: string, friendId: string) {
    await this.prismaService.friendRelation.deleteMany({
      where: {
        OR: [
          { userId1: userId, userId2: friendId },
          { userId1: friendId, userId2: userId },
        ],
      },
    });
    return {};
  }

  async getFriends(userId: string, query: QueryWithOrderedBy<UserOrderByKeys>) {
    const where = {
      AND: [
        {
          OR: [
            {
              name: {
                contains: query.search,
                mode: 'insensitive' as const,
              },
            },
          ],
        },
        { id: { not: userId } },
        {
          OR: [
            {
              friendRelations1: {
                some: { OR: [{ userId1: userId }, { userId2: userId }] },
              },
            },
            {
              friendRelations2: {
                some: { OR: [{ userId1: userId }, { userId2: userId }] },
              },
            },
          ],
        },
      ],
    };

    let orderByResult = parseOrderBy<UserOrderByKeys>(query.orderBy, {
      lastName: (v) => {
        return {
          lastname: v,
        };
      },
    });

    const [friends, count] = await Promise.all([
      this.prismaService.user.findMany({
        where,
        orderBy: orderByResult,
        omit: { hashedPassword: true },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prismaService.user.count({ where }),
    ]);

    return getResponse(friends, count);
  }
}
