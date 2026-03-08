import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Prisma } from 'generated/prisma';
import { QueryType, QueryWithOrderedBy } from 'src/types/query';
import getResponse from 'src/utils/getResponse';
import { UserOrderByKeys } from './user.schema';
import { parseOrderBy } from 'src/utils/parseOrderBy';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}
  async getUsers({
    limit,
    page,
    search,
    orderBy,
  }: QueryWithOrderedBy<UserOrderByKeys>) {
    let where = {};

    if (search.split(' ').length === 1)
      where = {
        OR: [
          { login: { contains: search, mode: 'insensitive' } },
          { id: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
          { lastname: { contains: search, mode: 'insensitive' } },
        ],
      };
    else {
      const names = search.split(' ');
      const firstName = names[0];
      const lastName = names[1];

      where = {
        OR: [
          {
            AND: [
              { name: { contains: firstName, mode: 'insensitive' as const } },
              {
                lastname: { contains: lastName, mode: 'insensitive' as const },
              },
            ],
          },
          {
            AND: [
              { name: { contains: lastName, mode: 'insensitive' as const } },
              {
                lastname: { contains: firstName, mode: 'insensitive' as const },
              },
            ],
          },
        ],
      };
    }

    let orderByResult = parseOrderBy<UserOrderByKeys>(orderBy, {
      lastName: (v) => {
        return {
          lastname: v,
        };
      },
    });

    console.log(orderByResult);

    const [users, count] = await Promise.all([
      this.prismaService.user.findMany({
        where: {
          OR: [
            { login: { contains: search, mode: 'insensitive' } },
            { id: { contains: search, mode: 'insensitive' } },
            { name: { contains: search, mode: 'insensitive' } },
            { lastname: { contains: search, mode: 'insensitive' } },
          ],
        },
        orderBy: orderByResult,
        skip: (page - 1) * limit,
        take: limit,
        omit: { hashedPassword: true },
      }),
      this.prismaService.user.count({ where }),
    ]);

    return getResponse(users, count);
  }

  async deleteUser(userId: string) {
    await this.prismaService.user.delete({
      where: { id: userId },
    });

    return {};
  }

  async getInvitableUsers(userId: string) {
    const where = {
      AND: [
        {
          id: {
            not: userId,
          },
        },
        {
          friendRequestsSent: {
            none: {
              recipentId: userId,
            },
          },
        },
        {
          friendRequestsReceived: {
            none: {
              senderId: userId,
            },
          },
        },
        {
          friendRelations1: {
            none: { OR: [{ userId1: userId }, { userId2: userId }] },
          },
        },
        {
          friendRelations2: {
            none: { OR: [{ userId1: userId }, { userId2: userId }] },
          },
        },
      ],
    };

    const [users, count] = await Promise.all([
      this.prismaService.user.findMany({
        where,
        omit: {
          hashedPassword: true,
        },
      }),
      ,
      this.prismaService.user.count({ where }),
    ]);

    return getResponse(users, count);
  }

  async updateUser(userId: string, data: Prisma.UserUpdateInput) {
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data,
      omit: { hashedPassword: true },
      include: {
        userData: {
          omit: { userId: true, id: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUserByIdOrLogin(id: string, yourId?: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [
          {
            id,
          },
          {
            login: id,
          },
        ],
      },
      omit: { hashedPassword: true },
      include: {
        userData: {
          omit: {
            userId: true,
            id: true,
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const chat = await this.prismaService.groupChat.findFirst({
      where: {
        AND: [
          { type: 'DIRECT' },
          {
            usersInGroupChat: {
              some: { userId: user.id },
            },
          },
          {
            usersInGroupChat: {
              some: { userId: yourId },
            },
          },
        ],
      },
    });

    const result = {
      ...user,
      chatId: chat ? chat.id : null,
    };

    const followedRelation = await this.prismaService.followedUser.findFirst({
      where: {
        followedId: id,
        followerId: yourId,
      },
    });

    if (followedRelation) {
      return {
        ...result,
        isFollowed: true,
      };
    }

    return result;
  }
}
