import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PostsService } from '../modules/posts/posts.service';
import { CommentsService } from 'src/modules/comments/comments.service';

@Injectable()
export class CommentAuthorGuard implements CanActivate {
  constructor(private commentsService: CommentsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.userId;
    const commentId = request.params.id;

    if (!userId || !commentId) return false;

    const comment = await this.commentsService.getComment(commentId);
    const commentAuthor = comment?.authorId;

    return userId && commentAuthor && userId === commentAuthor;
  }
}
