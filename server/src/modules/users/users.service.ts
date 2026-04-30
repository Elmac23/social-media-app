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
import { parseUserWhere } from 'src/utils/parseUserWhere';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}
  async getUsers({
    limit,
    page,
    search,
    orderBy,
  }: QueryWithOrderedBy<UserOrderByKeys>) {
    const where = parseUserWhere(search);

    let orderByResult = parseOrderBy<UserOrderByKeys>(orderBy, {
      lastName: (v) => {
        return {
          lastname: v,
        };
      },
    });

    const [users, count] = await Promise.all([
      this.prismaService.user.findMany({
        where,
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
        _count: {
          select: {
            posts: true,
            comments: true,
            friendRelations1: true,
            friendRelations2: true,
            followed: true,
            followers: true,
          },
        },
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

    const { _count, ...rest } = user;

    const result = {
      ...rest,
      followersCount: _count.followers,
      followingCount: _count.followed,
      friendsCount: _count.friendRelations1 + _count.friendRelations2,
      postsCount: _count.posts,
      commentsCount: _count.comments,
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
