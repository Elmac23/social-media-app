import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { ZodValidationPipe } from 'src/pipes/ZodValidationPipe';
import { AuthenticationGuard } from 'src/guards/authentication';
import { Request } from 'express';
import { Req } from '@nestjs/common';
import { userDataSchema, UserUpdateDto, userUpdateSchema } from './user.schema';
import { PostsService } from 'src/modules/posts/posts.service';
import { UserId } from 'src/decorators/user-id';
import { SelfOrAdminGuard } from 'src/guards/self-or-admin';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
  ) {}
  @Get()
  async getUsers() {
    return await this.usersService.getUsers();
  }

  @Get('/invitable')
  @UseGuards(AuthenticationGuard)
  async getInvitableUsers(@UserId() userId: string) {
    return await this.usersService.getInvitableUsers(userId);
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  async getUserById(@Param('id') id: string, @UserId() viewerId?: string) {
    return await this.usersService.getUserByIdOrLogin(id, viewerId);
  }
  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthenticationGuard, SelfOrAdminGuard)
  async deleteUser(@Param('id') userId: string) {
    await this.usersService.deleteUser(userId);
    return {};
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, SelfOrAdminGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      dest: 'public/avatars',
    }),
  )
  async updateUser(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(userUpdateSchema)) data: UserUpdateDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const { userData, ...rest } = data;

    const avatarUrl = image ? `/public/avatars/${image.filename}` : undefined;

    return await this.usersService.updateUser(id, {
      avatarUrl,
      ...rest,
      userData: {
        upsert: {
          create: userData || {},
          update: userData || {},
        },
      },
    });
  }
}
