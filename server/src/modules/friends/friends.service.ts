import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

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

  async getFriends(userId: string) {
    const friends = await this.prismaService.user.findMany({
      where: {
        AND: {
          id: { not: userId },
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
      },
      omit: { hashedPassword: true },
    });

    return friends;
  }
}
