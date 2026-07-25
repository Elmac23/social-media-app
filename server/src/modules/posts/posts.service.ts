import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PostOrderByKeys, UpdatePostDto } from './posts.schema';
import { unzipCountFields } from 'src/utils/unzip-count-fields';
import { Post, PrivacyLevel } from 'generated/prisma';
import { unlink } from 'fs/promises';
import { QueryType, QueryWithOrderedBy } from 'src/types/query';
import { count } from 'console';
import getResponse from 'src/utils/getResponse';
import { parseOrderBy } from 'src/utils/parseOrderBy';
import { parseUserWhere } from 'src/utils/parseUserWhere';

@Injectable()
export class PostsService {
  constructor(private prismaService: PrismaService) {}

  async createPost(
    authorId: string,
    content: string,
    privacy: PrivacyLevel,
    fileId?: string,
  ) {
    return this.prismaService.post.create({
      data: {
        authorId,
        content,
        privacy,
        fileId,
      },
    });
  }

  async deletePost(postId: string) {
    const post = await this.prismaService.post.delete({
      where: { id: postId },
      include: {
        file: true,
      },
    });

    const { file } = post;
    if (file) {
      try {
        await unlink(__dirname + '/../../../' + file.path);
        await this.prismaService.file.delete({
          where: {
            id: file.id,
          },
        });
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }

    return {};
  }

  async processLikedAndSharedStatus<T extends { id: string }>(
    post: T,
    userId?: string,
  ) {
    if (!userId) return post;

    const likeReltion = await this.prismaService.like.findUnique({
      where: {
        userId_postId: {
          postId: post.id,
          userId,
        },
      },
    });

    const shareReltion = await this.prismaService.sharedPost.findUnique({
      where: {
        postId_userId: {
          postId: post.id,
          userId,
        },
      },
    });

    return {
      ...(post as T),
      isLikedByMe: !!likeReltion,
      isSharedByMe: !!shareReltion,
    };
  }

  async getPostById(postId: string, userId?: string) {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          omit: { hashedPassword: true },
        },
        _count: {
          select: { likes: true, comments: true, sharedPosts: true },
        },
      },
    });

    if (!post) throw new NotFoundException('Post not found');

    const unzippedData = unzipCountFields(post, [
      'likes',
      'comments',
      'sharedPosts',
    ]);

    return await this.processLikedAndSharedStatus(unzippedData, userId);
  }

  async getUserPosts(userId: string, yourId?: string) {
    const where = { authorId: userId };
    const [posts, count] = await Promise.all([
      this.prismaService.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            omit: { hashedPassword: true },
          },
          _count: {
            select: { likes: true, comments: true },
          },
        },
      }),
      this.prismaService.post.count({ where }),
    ]);

    const unzippedPosts = posts.map((post) =>
      unzipCountFields(post, ['likes', 'comments']),
    );

    if (!yourId) return getResponse(unzippedPosts, count);

    const result = await Promise.all(
      unzippedPosts.map((post) =>
        this.processLikedAndSharedStatus(post, yourId),
      ),
    );

    return getResponse(result, count);
  }

  async getPosts({
    limit,
    page,
    search,
    orderBy,
  }: QueryWithOrderedBy<PostOrderByKeys>) {
    const where = {
      OR: [
        {
          content: { contains: search, mode: 'insensitive' as const },
        },
        { author: parseUserWhere(search) },
      ],
    };

    const orderByResult = parseOrderBy(orderBy, {
      likes: (v) => {
        return {
          likes: {
            _count: v,
          },
        };
      },
      responses: (v) => {
        return {
          comments: {
            _count: v,
          },
        };
      },

      reposts: (v) => {
        return {
          sharedPosts: {
            _count: v,
          },
        };
      },
      author: (v) => {
        return {
          authorId: v,
        };
      },
    });

    const [posts, count] = await Promise.all([
      this.prismaService.post.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where,
        orderBy: orderByResult,
        include: {
          author: {
            omit: { hashedPassword: true },
          },
          _count: {
            select: { likes: true, comments: true, sharedPosts: true },
          },
        },
      }),
      this.prismaService.post.count({ where }),
    ]);

    const unzippedPosts = posts.map((post) =>
      unzipCountFields(post, ['likes', 'comments', 'sharedPosts']),
    );

    return getResponse(unzippedPosts, count);
  }

  async getUserReposts(userId: string, yourId?: string) {
    const where = { sharedPosts: { some: { userId } } };
    const [posts, count] = await Promise.all([
      this.prismaService.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            omit: { hashedPassword: true },
          },
          _count: {
            select: { likes: true, comments: true },
          },
        },
      }),
      this.prismaService.post.count({ where }),
    ]);

    const unzippedPosts = posts.map((post) =>
      unzipCountFields(post, ['likes', 'comments']),
    );

    if (!yourId) return unzippedPosts;

    const result = await Promise.all(
      unzippedPosts.map((post) =>
        this.processLikedAndSharedStatus(post, yourId),
      ),
    );

    return getResponse(result, count);
  }

  async getUserProfilePosts(userId: string, yourId?: string) {
    const [usersPosts, userPostsCount] = await Promise.all([
      this.prismaService.post.findMany({
        where: {
          authorId: userId,
        },
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            omit: { hashedPassword: true },
          },
          _count: {
            select: { likes: true, comments: true },
          },
        },
      }),
      this.prismaService.post.count({
        where: {
          authorId: userId,
        },
      }),
    ]);

    const [reposts, repostsCount] = await Promise.all([
      this.prismaService.sharedPost.findMany({
        where: {
          userId,
        },
        orderBy: { createdAt: 'desc' },
        include: {
          post: {
            include: {
              author: {
                omit: { hashedPassword: true },
              },
              _count: {
                select: { likes: true, comments: true },
              },
            },
          },
        },
      }),
      this.prismaService.sharedPost.count({ where: { userId } }),
    ]);

    const totalCount = repostsCount + userPostsCount;

    const allPosts = [...usersPosts, ...reposts];
    allPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const unpackedReposts = allPosts.map((item) => {
      if ('post' in item) {
        return item.post;
      }
      return item;
    });

    const unzippedPosts = unpackedReposts.map((post) =>
      unzipCountFields(post, ['likes', 'comments']),
    );

    if (!yourId) return getResponse(unzippedPosts, totalCount);

    const result = await Promise.all(
      unzippedPosts.map((post) =>
        this.processLikedAndSharedStatus(post, yourId),
      ),
    );

    return getResponse(result, totalCount);
  }

  async updatePost(postId: string, data: UpdatePostDto) {
    return this.prismaService.post.update({
      where: { id: postId },
      data,
    });
  }
}
