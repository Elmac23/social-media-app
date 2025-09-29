import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { unzipCountFields } from 'src/utils/unzip-count-fields';

@Injectable()
export class PostCommentsService {
  constructor(private prismaService: PrismaService) {}

  async getCommentsByPost(postId: string) {
    const comments = await this.prismaService.comment.findMany({
      where: { postId, parentCommentId: null },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { likes: true, subComments: true },
        },
        author: {
          omit: { hashedPassword: true },
        },
      },
    });

    return comments.map((c) => unzipCountFields(c, ['likes', 'subComments']));
  }
}
