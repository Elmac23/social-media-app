import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PostsService } from '../modules/posts/posts.service';

@Injectable()
export class PostAuthorGuard implements CanActivate {
  constructor(private postsService: PostsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.userId;
    const postId = request.params.id;

    if (!userId || !postId) return false;

    const post = await this.postsService.getPostById(postId);
    const postAuthorId = post?.authorId;

    return userId && postAuthorId && userId === postAuthorId;
  }
}
