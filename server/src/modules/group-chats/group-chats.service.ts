import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupChatDto } from './group-chats.schema';
import { Query } from 'src/types/query';

@Injectable()
export class GroupChatsService {
  constructor(private prismaService: PrismaService) {}

  async createGroupChat(groupChatDto: CreateGroupChatDto) {
    const { memberIds, ...groupChatData } = groupChatDto;

    const groupChat = await this.prismaService.groupChat.create({
      data: {
        ...groupChatData,
        usersInGroupChat: {
          createMany: {
            data: memberIds.map((id) => ({ userId: id })),
          },
        },
      },
    });

    return groupChat;
  }

  async addMember(groupChatId: string, userId: string) {
    return this.prismaService.userInGroupChat.create({
      data: {
        groupChatId,
        userId,
      },
    });
  }

  async getUsersGroupChats(userId: string, query?: Query) {
    const { limit, page, search } = query;

    const searchQuery = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
            {
              usersInGroupChat: {
                some: {
                  user: {
                    OR: [
                      {
                        login: {
                          contains: search,
                          mode: 'insensitive' as const,
                        },
                      },
                      {
                        name: {
                          contains: search,
                          mode: 'insensitive' as const,
                        },
                      },
                      {
                        lastname: {
                          contains: search,
                          mode: 'insensitive' as const,
                        },
                      },
                    ],
                  },
                },
              },
            },
          ],
        }
      : undefined;

    const where = {
      usersInGroupChat: {
        some: {
          userId,
        },
      },
      ...(searchQuery && searchQuery),
    };

    const result = await this.prismaService.groupChat.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        usersInGroupChat: {
          include: {
            user: {
              omit: {
                hashedPassword: true,
              },
            },
          },
        },
      },
      where,
    });

    return result.map((groupChat) => {
      const { usersInGroupChat, ...groupChatData } = groupChat;
      const members = usersInGroupChat.map((entry) => entry.user);
      return { ...groupChatData, members };
    });
  }

  async getGroupChatById(groupChatId: string) {
    const { usersInGroupChat, ...groupData } =
      await this.prismaService.groupChat.findUnique({
        where: { id: groupChatId },
        include: {
          usersInGroupChat: {
            include: {
              user: {
                omit: {
                  hashedPassword: true,
                },
              },
            },
          },
        },
      });

    return { groupData, members: usersInGroupChat.map((u) => u.user) };
  }

  async removeMember(groupChatId: string, userId: string) {
    return this.prismaService.userInGroupChat.deleteMany({
      where: {
        groupChatId,
        userId,
      },
    });
  }
}
