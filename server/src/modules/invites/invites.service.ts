import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FriendRequestDto } from './invites.schema';
import { UserFollowersService } from '../users/user-followers/user-followers.service';
import { GroupChatsService } from '../group-chats/group-chats.service';
import getResponse from 'src/utils/getResponse';

@Injectable()
export class InvitesService {
  constructor(
    private prismaService: PrismaService,
    private userFollowersService: UserFollowersService,
    private groupChatsService: GroupChatsService,
  ) {}

  async getAllInvites() {
    const data = await this.prismaService.friendRequest.findMany();
    const count = await this.prismaService.friendRequest.count();

    return getResponse(data, count);
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

    const existingChat = await this.prismaService.groupChat.findFirst({
      where: {
        type: 'DIRECT',
        usersInGroupChat: {
          every: {
            OR: [{ userId: senderId }, { userId: recipentId }],
          },
        },
      },
    });

    if (!existingChat) {
      await this.groupChatsService.createGroupChat({
        name: null,
        description: null,
        memberIds: [senderId, recipentId],
        type: 'DIRECT',
      });
    }

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
    const existingInvite = await this.prismaService.friendRequest.findUnique({
      where: {
        senderId_recipentId: {
          recipentId: senderId,
          senderId: recipentId,
        },
      },
    });

    if (existingInvite) {
      return this.acceptInvite(existingInvite.id);
    }

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
    const whereRecipent = { recipentId: userId };
    const [receivedInvites, receivedInvitesCount] = await Promise.all([
      this.prismaService.friendRequest.findMany({
        where: whereRecipent,
        select: {
          sender: {
            omit: { hashedPassword: true },
          },
          id: true,
          createdAt: true,
        },
      }),
      this.prismaService.friendRequest.count({ where: whereRecipent }),
    ]);

    const whereSender = { senderId: userId };

    const [sentInvites, sentInvitedCount] = await Promise.all([
      this.prismaService.friendRequest.findMany({
        where: whereSender,
        select: {
          recipent: {
            omit: { hashedPassword: true },
          },
          id: true,
          createdAt: true,
        },
      }),
      this.prismaService.friendRequest.count({ where: whereSender }),
    ]);

    return {
      sentInvites: getResponse(sentInvites, receivedInvitesCount),
      receivedInvites: getResponse(receivedInvites, sentInvitedCount),
    };
  }

  async deleteInvite(inviteId: string) {
    await this.prismaService.friendRequest.delete({
      where: { id: inviteId },
    });
  }
}
