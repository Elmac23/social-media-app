import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/modules/prisma/prisma.module';

import { UserFollowersController } from './user-followers.controller';
import { UserFollowersService } from './user-followers.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserFollowersController],
  providers: [UserFollowersService],
  exports: [UserFollowersService],
})
export class UserFollowersModule {}
