import { Injectable } from '@nestjs/common';
import { CommentDto, UpdateCommentDto } from './comment.schema';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { unzipCountFields } from 'src/utils/unzip-count-fields';
import { Comment } from 'generated/prisma';

@Injectable()
export class CommentsService {
  constructor(private prismaService: PrismaService) {}

  async updateComment(commentId: string, data: UpdateCommentDto) {
    return this.prismaService.comment.update({
      where: { id: commentId },
      data: {
        content: data.content,
      },
    });
  }

  async processLikedStatus<T>(comment: T, userId?: string) {
    if (!userId) return comment;
    const likeReltion = await this.prismaService.commentLike.findUnique({
      where: {
        userId_commentId: {
          commentId: (comment as Comment).id,
          userId,
        },
      },
    });
    return {
      ...(comment as T),
      isLikedByMe: !!likeReltion,
    };
  }

  async getComments(userId?: string) {
    const comment = await this.prismaService.comment.findMany({
      include: {
        _count: {
          select: { likes: true, subComments: true },
        },
        author: {
          omit: { hashedPassword: true },
        },
      },
    });

    const unzippedComments = comment.map((c) =>
      unzipCountFields(c, ['likes', 'subComments']),
    );

    if (!userId) return unzippedComments;

    return Promise.all(
      unzippedComments.map((c) => this.processLikedStatus(c, userId)),
    );
  }

  async getComment(id: string, userId?: string) {
    const comment = await this.prismaService.comment.findUnique({
      where: { id },
      include: {
        _count: {
          select: { likes: true, subComments: true },
        },
        author: {
          omit: { hashedPassword: true },
        },
      },
    });

    const unzippedComment = unzipCountFields(comment, ['likes', 'subComments']);

    if (!userId) return unzippedComment;

    return this.processLikedStatus(unzippedComment, userId);
  }

  async createComment(data: CommentDto) {
    return await this.prismaService.comment.create({
      data: {
        content: data.content,
        authorId: data.authorId,
        postId: data.postId,
        parentCommentId: data.parentCommentId,
      },
    });
  }

  async getCommentsByParentComment(parentCommentId: string, userId?: string) {
    const comments = await this.prismaService.comment.findMany({
      where: { parentCommentId },
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

    const unzippedComments = comments.map((c) =>
      unzipCountFields(c, ['likes', 'subComments']),
    );

    if (!userId) return unzippedComments;

    return Promise.all(
      unzippedComments.map((c) => this.processLikedStatus(c, userId)),
    );
  }

  async deleteComment(commentId: string) {
    await this.prismaService.comment.delete({
      where: { id: commentId },
    });
    return {};
  }
}
