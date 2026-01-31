import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupChatDto, UpdateGroupChatDto } from './group-chats.schema';
import { QueryType } from 'src/types/query';

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

  async updateGroupChat(groupChatId: string, data: UpdateGroupChatDto) {
    return this.prismaService.groupChat.update({
      where: {
        id: groupChatId,
      },
      data,
    });
  }

  async addMember(groupChatId: string, userId: string) {
    return await this.prismaService.userInGroupChat.create({
      data: {
        groupChatId,
        userId,
      },
    });
  }

  async getUsersGroupChats(userId: string, query?: QueryType) {
    const { limit, page, search } = query || { limit: 10, page: 1, search: '' };

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
      orderBy: {
        lastMessageAt: 'desc',
      },
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
        messages: {
          include: {
            sender: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
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

    return { ...groupData, members: usersInGroupChat.map((u) => u.user) };
  }

  async removeMember(groupChatId: string, userId: string) {
    await this.prismaService.userInGroupChat.deleteMany({
      where: {
        groupChatId,
        userId,
      },
    });
  }
}
