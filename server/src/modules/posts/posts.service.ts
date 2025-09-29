import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UpdatePostDto } from './posts.schema';
import { unzipCountFields } from 'src/utils/unzip-count-fields';
import { Post } from 'generated/prisma';
import { unlink } from 'fs/promises';

@Injectable()
export class PostsService {
  constructor(private prismaService: PrismaService) {}

  async createPost(authorId: string, content: string, imageUrl?: string) {
    return this.prismaService.post.create({
      data: {
        authorId,
        content,
        imageUrl,
      },
    });
  }

  async deletePost(postId: string) {
    const post = await this.prismaService.post.delete({
      where: { id: postId },
    });

    const { imageUrl } = post;
    if (imageUrl) {
      try {
        await unlink(__dirname + '/../../../' + imageUrl);
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
          select: { likes: true, comments: true },
        },
      },
    });

    const unzippedData = unzipCountFields(post, ['likes', 'comments']);

    return await this.processLikedAndSharedStatus(unzippedData, userId);
  }

  async getUserPosts(userId: string, yourId?: string) {
    const posts = await this.prismaService.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          omit: { hashedPassword: true },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    const unzippedPosts = posts.map((post) =>
      unzipCountFields(post, ['likes', 'comments']),
    );

    if (!yourId) return unzippedPosts;

    return await Promise.all(
      unzippedPosts.map((post) =>
        this.processLikedAndSharedStatus(post, yourId),
      ),
    );
  }

  async getUserReposts(userId: string, yourId?: string) {
    const posts = await this.prismaService.post.findMany({
      where: { sharedPosts: { some: { userId } } },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          omit: { hashedPassword: true },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    const unzippedPosts = posts.map((post) =>
      unzipCountFields(post, ['likes', 'comments']),
    );

    if (!yourId) return unzippedPosts;

    return await Promise.all(
      unzippedPosts.map((post) =>
        this.processLikedAndSharedStatus(post, yourId),
      ),
    );
  }

  async getUserProfilePosts(userId: string, yourId?: string) {
    const usersPosts = await this.prismaService.post.findMany({
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
    });

    const reposts = await this.prismaService.sharedPost.findMany({
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
    });

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

    if (!yourId) return unzippedPosts;

    return await Promise.all(
      unzippedPosts.map((post) =>
        this.processLikedAndSharedStatus(post, yourId),
      ),
    );
  }

  async getPosts(userId?: string) {
    const posts = await this.prismaService.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          omit: { hashedPassword: true },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    const unzippedPosts = posts.map((post) =>
      unzipCountFields(post, ['likes', 'comments']),
    );

    if (!userId) return unzippedPosts;

    return await Promise.all(
      unzippedPosts.map((post) =>
        this.processLikedAndSharedStatus(post, userId),
      ),
    );
  }

  async updatePost(postId: string, data: UpdatePostDto) {
    return this.prismaService.post.update({
      where: { id: postId },
      data,
    });
  }
}
