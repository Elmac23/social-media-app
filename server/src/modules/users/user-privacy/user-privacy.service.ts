import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UserPrivacyDto } from './user-privacy.schema';

@Injectable()
export class UserPrivacyService {
  constructor(private prismaService: PrismaService) {}

  async editPrivacySettings(userId: string, settings: UserPrivacyDto) {
    return this.prismaService.userPrivacy.upsert({
      where: { userId },
      create: { userId, ...settings },
      update: { ...settings },
    });
  }

  async getPrivacySettings(userId: string) {
    return this.prismaService.userPrivacy.findUnique({
      where: { userId },
    });
  }
}
