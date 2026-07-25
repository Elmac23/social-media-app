import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { PrivacyLevel } from 'generated/prisma';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PrismaService } from 'src/modules/prisma/prisma.service';

export interface PostWithAuthor {
  id: string;
  authorId: string;
  privacy: PrivacyLevel;
  author?: {
    id: string;
  };
  [key: string]: any;
}

@Injectable()
export class PostPrivacyInterceptor implements NestInterceptor {
  constructor(private prismaService: PrismaService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const viewerId = request.userId;

    return next.handle().pipe(
      map(async (data) => {
        // Handle single post
        if (
          data &&
          typeof data === 'object' &&
          'id' in data &&
          'authorId' in data
        ) {
          const filtered = await this.filterPost(
            data as PostWithAuthor,
            viewerId,
          );
          // Return null to trigger 404, or you could throw NotFoundException
          return filtered;
        }

        // Handle paginated response with data property
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          Array.isArray(data.data)
        ) {
          const filteredPosts = await Promise.all(
            data.data.map((post: PostWithAuthor) =>
              this.filterPost(post, viewerId),
            ),
          );
          // Filter out null values and update count
          const visiblePosts = filteredPosts.filter(
            (post): post is PostWithAuthor => post !== null,
          );
          return {
            ...data,
            data: visiblePosts,
            count: visiblePosts.length,
          };
        }

        // Handle array of posts
        if (Array.isArray(data)) {
          const filteredPosts = await Promise.all(
            data.map((post: PostWithAuthor) => this.filterPost(post, viewerId)),
          );
          // Filter out null values
          return filteredPosts.filter(
            (post): post is PostWithAuthor => post !== null,
          );
        }

        return data;
      }),
    );
  }

  private async filterPost(
    post: PostWithAuthor,
    viewerId: string | undefined,
  ): Promise<PostWithAuthor | null> {
    const isAuthor = post.authorId === viewerId;
    const isAdmin = (viewerId && (await this.isAdmin(viewerId))) || false;

    if (isAuthor || isAdmin) return post;

    const visibilityLevel = await this.getVisibilityLevel(
      viewerId,
      post.authorId,
    );

    if (!this.isPostVisible(post.privacy, visibilityLevel)) {
      return null;
    }

    return post;
  }

  private isPostVisible(
    postPrivacy: PrivacyLevel,
    viewerLevel: PrivacyLevel,
  ): boolean {
    const PRIVACY_HIERARCHY: PrivacyLevel[] = ['PUBLIC', 'FRIENDS', 'PRIVATE'];
    return (
      PRIVACY_HIERARCHY.indexOf(viewerLevel) >=
      PRIVACY_HIERARCHY.indexOf(postPrivacy)
    );
  }

  private async getVisibilityLevel(
    viewerId: string | undefined,
    authorId: string,
  ): Promise<PrivacyLevel> {
    if (!viewerId) return 'PUBLIC';
    if (viewerId === authorId) return 'PRIVATE';

    const friendshipStatus = await this.prismaService.friendRelation.findFirst({
      where: {
        OR: [
          { userId1: viewerId, userId2: authorId },
          { userId1: authorId, userId2: viewerId },
        ],
      },
    });

    if (friendshipStatus) return 'FRIENDS';

    return 'PUBLIC';
  }

  private async isAdmin(userId: string): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    return user?.role === 'ADMIN';
  }
}
