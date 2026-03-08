import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { unzipCountFields } from 'src/utils/unzip-count-fields';
import { Comment } from 'generated/prisma';
import { QueryType, QueryWithOrderedBy } from 'src/types/query';
import getResponse from 'src/utils/getResponse';
import { parseOrderBy } from 'src/utils/parseOrderBy';
import {
  CommentDto,
  CommentOrderByKeys,
  UpdateCommentDto,
} from './comments.schema';

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

  async getComments({
    limit,
    page,
    search,
    orderBy,
  }: QueryWithOrderedBy<CommentOrderByKeys>) {
    let whereQuery = {};

    if (search.split(' ').length === 1) {
      whereQuery = {
        OR: [
          {
            author: {
              OR: [
                { login: { contains: search, mode: 'insensitive' } },
                { id: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
                { lastname: { contains: search, mode: 'insensitive' } },
              ],
            },
          },
          {
            content: { contains: search, mode: 'insensitive' },
          },
        ],
      };
    } else if (search.split(' ').length === 2) {
      const names = search.split(' ');
      const firstName = names[0];
      const lastName = names[1];

      whereQuery = {
        OR: [
          { content: { contains: search, mode: 'insensitive' } },
          {
            author: {
              OR: [
                {
                  AND: [
                    { name: { contains: firstName, mode: 'insensitive' } },
                    { lastname: { contains: lastName, mode: 'insensitive' } },
                  ],
                },
                {
                  AND: [
                    { name: { contains: lastName, mode: 'insensitive' } },
                    {
                      lastname: { contains: firstName, mode: 'insensitive' },
                    },
                  ],
                },
              ],
            },
          },
        ],
      };
    } else {
      whereQuery = {
        content: { contains: search, mode: 'insensitive' },
      };
    }

    const orderByResult = parseOrderBy(orderBy, {
      author: (v) => {
        return {
          author: {
            login: v,
          },
        };
      },
      likes: (v) => {
        return {
          likes: {
            _count: v,
          },
        };
      },

      responses: (v) => {
        return {
          subComments: {
            _count: v,
          },
        };
      },
    });

    const [comments, count] = await Promise.all([
      this.prismaService.comment.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: whereQuery,
        orderBy: orderByResult,

        include: {
          _count: {
            select: { likes: true, subComments: true },
          },
          author: {
            omit: { hashedPassword: true },
          },
        },
      }),
      this.prismaService.comment.count({ where: whereQuery }),
    ]);

    const unzippedComments = comments.map((c) =>
      unzipCountFields(c, ['likes', 'subComments']),
    );

    return getResponse(unzippedComments, count);
  }

  async getCommentAsUser(id: string, userId?: string) {
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

    if (!comment) return null;

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
    const [comments, count] = await Promise.all([
      this.prismaService.comment.findMany({
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
      }),
      this.prismaService.comment.count({ where: { parentCommentId } }),
    ]);

    const unzippedComments = comments.map((c) =>
      unzipCountFields(c, ['likes', 'subComments']),
    );

    if (!userId) return getResponse(comments, count);

    const result = await Promise.all(
      unzippedComments.map((c) => this.processLikedStatus(c, userId)),
    );

    return getResponse(result, count);
  }

  async deleteComment(commentId: string) {
    await this.prismaService.comment.delete({
      where: { id: commentId },
    });
    return {};
  }
}
