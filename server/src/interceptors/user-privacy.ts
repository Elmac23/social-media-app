import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { PrivacyLevel, UserPrivacy } from 'generated/prisma';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Prisma } from 'generated/prisma';

type UserWithUserData = Prisma.UserGetPayload<{
  include: { userData: true };
  omit: { hashedPassword: true };
}>;

export interface Response<UserWithUserData> {
  data: UserWithUserData;
}

@Injectable()
export class UserPrivacyInterceptor implements NestInterceptor {
  constructor(private prismaService: PrismaService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const viewerId = request.userId;
    const userId = request.params.id;

    const userPrivacyLevel = await this.getVisibilityLevel(viewerId, userId);

    const userPrivacy = await this.prismaService.userPrivacy.findUnique({
      where: { userId },
    });

    const PRIVACY_HIERARCHY: PrivacyLevel[] = ['PUBLIC', 'FRIENDS', 'PRIVATE'];

    const userDataKeys: (keyof UserPrivacy)[] = [
      'schools',
      'hobbies',
      'jobs',
      'primaryLanguage',
      'otherLanguages',
      'phoneNumber',
    ];

    const userKeys: (keyof UserPrivacy)[] = ['email', 'dateOfBirth'];

    return next.handle().pipe(
      map((data: UserWithUserData) => {
        for (const k in userPrivacy) {
          const key = k as keyof UserPrivacy;

          if (key === 'id' || key === 'userId') continue;

          if (
            key === 'location' &&
            !this.isVisibleField(userPrivacy[key], userPrivacyLevel)
          ) {
            delete data['userData']?.city;
            delete data['userData']?.country;
          }

          if (userDataKeys.includes(key)) {
            if (
              !this.isVisibleField(userPrivacy[key], userPrivacyLevel) &&
              data.userData
            ) {
              data.userData[key] = undefined;
            }
          } else if (userKeys.includes(key)) {
            if (!this.isVisibleField(userPrivacy[key], userPrivacyLevel)) {
              data[key] = undefined;
            }
          }
        }

        return data;
      }),
    );
  }

  isVisibleField(fieldPrivacy: PrivacyLevel, userPrivacyLevel: PrivacyLevel) {
    const PRIVACY_HIERARCHY: PrivacyLevel[] = ['PUBLIC', 'FRIENDS', 'PRIVATE'];
    return (
      PRIVACY_HIERARCHY.indexOf(userPrivacyLevel) >=
      PRIVACY_HIERARCHY.indexOf(fieldPrivacy)
    );
  }

  async getVisibilityLevel(
    viewerId: string,
    userId: string,
  ): Promise<PrivacyLevel> {
    if (viewerId === userId) return 'PRIVATE';
    const friendshipStatus = await this.prismaService.friendRelation.findFirst({
      where: {
        OR: [
          { userId1: viewerId, userId2: userId },
          { userId1: userId, userId2: viewerId },
        ],
      },
    });

    if (friendshipStatus) return 'FRIENDS';

    return 'PUBLIC';
  }
}
