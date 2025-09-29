import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FriendRequestDto } from './invites.schema';
import { UserFollowersService } from '../users/user-followers/user-followers.service';

@Injectable()
export class InvitesService {
  constructor(
    private prismaService: PrismaService,
    private userFollowersService: UserFollowersService,
  ) {}

  async getAllInvites() {
    return await this.prismaService.friendRequest.findMany();
  }

  async acceptInvite(inviteId: string) {
    const invite = await this.prismaService.friendRequest.findUnique({
      where: { id: inviteId },
    });
    if (!invite) throw new BadRequestException('Invite not found');

    const { recipentId, senderId } = invite;

    try {
      await this.prismaService.friendRelation.create({
        data: {
          userId1: senderId,
          userId2: recipentId,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to accept friend');
    }

    await this.prismaService.friendRequest.delete({
      where: {
        senderId_recipentId: {
          recipentId,
          senderId,
        },
      },
    });

    try {
      await this.userFollowersService.follow(recipentId, senderId);
    } catch (error) {}

    try {
      await this.userFollowersService.follow(senderId, recipentId);
    } catch (error) {}
    return {};
  }

  async inviteUser({
    recipentId,
    senderId,
  }: FriendRequestDto & { senderId: string }) {
    try {
      await this.prismaService.friendRequest.create({
        data: {
          recipentId,
          senderId,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to create friend request');
    }
  }

  async getUserInvites(userId: string) {
    const receivedInvites = await this.prismaService.friendRequest.findMany({
      where: { recipentId: userId },
      select: {
        sender: {
          omit: { hashedPassword: true },
        },
        id: true,
        createdAt: true,
      },
    });

    const sentInvites = await this.prismaService.friendRequest.findMany({
      where: { senderId: userId },
      select: {
        recipent: {
          omit: { hashedPassword: true },
        },
        id: true,
        createdAt: true,
      },
    });
    return { sentInvites, receivedInvites };
  }

  async deleteInvite(inviteId: string) {
    await this.prismaService.friendRequest.delete({
      where: { id: inviteId },
    });
  }
}
