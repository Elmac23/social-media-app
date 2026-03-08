import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { QueryType } from 'src/types/query';
import getResponse from 'src/utils/getResponse';

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

  async getFriends(
    userId: string,
    query: QueryType = { page: 1, limit: 10, search: '' },
  ) {
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
    const [friends, count] = await Promise.all([
      this.prismaService.user.findMany({
        where,
        omit: { hashedPassword: true },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prismaService.user.count({ where }),
    ]);

    return getResponse(friends, count);
  }
}
