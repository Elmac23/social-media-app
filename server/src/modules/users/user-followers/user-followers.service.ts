import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

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
    const followers = await this.prismaService.user.findMany({
      where: { followed: { some: { followedId: userId } } },
      omit: { hashedPassword: true },
    });
    const following = await this.prismaService.user.findMany({
      where: { followers: { some: { followerId: userId } } },
      omit: { hashedPassword: true },
    });
    return { followers, following };
  }

  async unfollow(followerId: string, followedId: string) {
    await this.prismaService.followedUser.delete({
      where: { followerId_followedId: { followerId, followedId } },
    });
    return {};
  }
}
