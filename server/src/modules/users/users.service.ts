import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}
  async getUsers() {
    return await this.prismaService.user.findMany({
      omit: { hashedPassword: true },
    });
  }

  async deleteUser(userId: string) {
    await this.prismaService.user.delete({
      where: { id: userId },
    });

    return {};
  }

  async getInvitableUsers(userId: string) {
    return await this.prismaService.user.findMany({
      where: {
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
      },
    });
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

    const followedRelation = await this.prismaService.followedUser.findFirst({
      where: {
        followedId: id,
        followerId: yourId,
      },
    });

    if (followedRelation) {
      return {
        ...user,
        isFollowed: true,
      };
    }

    return user;
  }
}
