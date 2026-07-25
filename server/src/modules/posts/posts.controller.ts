import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthenticationGuard } from 'src/guards/authentication';
import {
  PostDto,
  postOrderByKeys,
  PostOrderByKeys,
  postSchema,
  updatePostSchema,
} from './posts.schema';
import { ZodValidationPipe } from 'src/pipes/ZodValidationPipe';
import { UsersPostGuard } from '../../guards/users-post';
import { UserId } from 'src/decorators/user-id';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { diskStorage } from 'multer';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { AdminGuard } from 'src/guards/admin';
import { QueryPipe } from 'src/pipes/query.pipe';
import { QueryType, QueryWithOrderedBy } from 'src/types/query';
import { FilesService } from '../files/files.service';
import { v4 as uuid } from 'uuid';
import { PostPrivacyInterceptor } from 'src/interceptors/post-privacy';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private configService: ConfigService,
    private filesService: FilesService,
  ) {}

  @Get()
  @UseGuards(AuthenticationGuard, AdminGuard)
  @UseInterceptors(PostPrivacyInterceptor)
  async getPosts(
    @Query(new QueryPipe(postOrderByKeys))
    query: QueryWithOrderedBy<PostOrderByKeys>,
  ) {
    return await this.postsService.getPosts(query);
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(PostPrivacyInterceptor)
  async getPostById(@Param('id') id: string, @UserId() userId?: string) {
    console.log('postt');
    return await this.postsService.getPostById(id, userId);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      dest: 'files/posts',
    }),
  )
  @UseGuards(AuthenticationGuard)
  async createPost(
    @UserId() authorId: string,
    @Body(new ZodValidationPipe(postSchema)) body: PostDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const { content, privacy } = body;
    console.log(privacy);

    let fileId: string | undefined = undefined;

    if (image) {
      const imagePath = image.filename;
      const file = await this.filesService.createFile(
        {
          privacy,
          userId: authorId,
          mimeType: image.mimetype,
        },
        `/files/posts/${imagePath}`,
      );
      fileId = file.id;
    }

    const post = await this.postsService.createPost(
      authorId,
      content,
      privacy,
      fileId,
    );

    if (fileId) {
      await this.filesService.updateFile(fileId, { postId: post.id });
    }

    return post;
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, UsersPostGuard)
  async updatePost(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePostSchema)) body,
  ) {
    return this.postsService.updatePost(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, UsersPostGuard)
  async deletePost(@Param('id') id: string) {
    return await this.postsService.deletePost(id);
  }
}
