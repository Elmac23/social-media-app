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

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private configService: ConfigService,
  ) {}

  @Get()
  @UseGuards(AuthenticationGuard, AdminGuard)
  async getPosts(
    @Query(new QueryPipe(postOrderByKeys))
    query: QueryWithOrderedBy<PostOrderByKeys>,
  ) {
    return await this.postsService.getPosts(query);
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return await this.postsService.getPostById(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      dest: 'public/posts',
    }),
  )
  @UseGuards(AuthenticationGuard)
  async createPost(
    @UserId() authorId: string,
    @Body(new ZodValidationPipe(postSchema)) body: PostDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const { content } = body;

    const imageUrl = image ? `/public/posts/${image.filename}` : undefined;

    return await this.postsService.createPost(authorId, content, imageUrl);
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
