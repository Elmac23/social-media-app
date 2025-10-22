import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/modules/prisma/prisma.module';

import { UserPrivacyController } from './user-privacy.controller';
import { UserPrivacyService } from './user-privacy.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserPrivacyController],
  providers: [UserPrivacyService],
})
export class UserPrivacyModule {}
