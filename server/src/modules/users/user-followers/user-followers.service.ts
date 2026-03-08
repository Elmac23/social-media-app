import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import getResponse from 'src/utils/getResponse';

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

  async getFollowers(userId: string) {
    const followedWhere = { followed: { some: { followedId: userId } } };
    const followingWhere = { followers: { some: { followerId: userId } } };
    const [followers, followersCount, following, followingCount] =
      await Promise.all([
        this.prismaService.user.findMany({
          where: followedWhere,
          omit: { hashedPassword: true },
        }),
        this.prismaService.user.count({ where: followedWhere }),
        this.prismaService.user.findMany({
          where: followingWhere,
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
