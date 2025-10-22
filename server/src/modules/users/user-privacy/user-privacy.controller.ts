import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserPrivacyService } from './user-privacy.service';
import { UserId } from 'src/decorators/user-id';
import { UserPrivacyDto, userPrivacySchema } from './user-privacy.schema';
import { ZodValidationPipe } from 'src/pipes/ZodValidationPipe';
import { AuthenticationGuard } from 'src/guards/authentication';
import { UsersPostGuard } from 'src/guards/users-post';
import { SelfOrAdminGuard } from 'src/guards/self-or-admin';

@Controller('users/:id/privacy')
export class UserPrivacyController {
  constructor(private userPrivacyService: UserPrivacyService) {}

  @UseGuards(AuthenticationGuard, SelfOrAdminGuard)
  @Patch()
  async updatePrivacySettings(
    @Param('id') userId: string,
    @Body(new ZodValidationPipe(userPrivacySchema)) settings: UserPrivacyDto,
  ) {
    return this.userPrivacyService.editPrivacySettings(userId, settings);
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  async getPrivacySettings(@UserId() userId: string) {
    return this.userPrivacyService.getPrivacySettings(userId);
  }
}
