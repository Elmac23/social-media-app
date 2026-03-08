import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import getResponse from 'src/utils/getResponse';

@Injectable()
export class PostLikesService {
  constructor(private prismaService: PrismaService) {}

  async getLikes(postId: string) {
    const data = await this.prismaService.like.findMany({
      where: { postId },
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
