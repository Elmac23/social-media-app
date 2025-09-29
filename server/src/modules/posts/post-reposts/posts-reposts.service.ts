import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class PostRepostsService {
  constructor(private prismaService: PrismaService) {}

  async addRepost(postId: string, userId: string) {
    return this.prismaService.sharedPost.create({
      data: {
        postId,
        userId,
      },
    });
  }

  async deleteRepost(postId: string, userId: string) {
    await this.prismaService.sharedPost.delete({
      where: { postId_userId: { postId, userId } },
    });
    return {};
  }
}
