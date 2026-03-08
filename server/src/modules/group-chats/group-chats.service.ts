import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateGroupChatDto,
  GroupChatOrderByKeys,
  UpdateGroupChatDto,
} from './group-chats.schema';
import { QueryType, QueryWithOrderedBy } from 'src/types/query';
import { unzipCountFields } from 'src/utils/unzip-count-fields';
import getResponse from 'src/utils/getResponse';
import { parseOrderBy } from 'src/utils/parseOrderBy';

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

  async getGroupChats({
    limit,
    page,
    search,
    orderBy,
  }: QueryWithOrderedBy<GroupChatOrderByKeys>) {
    const where = {
      OR: [
        {
          name: { contains: search, mode: 'insensitive' as const },
        },
        {
          id: { contains: search, mode: 'insensitive' as const },
        },
      ],
    };

    const orderByResult = parseOrderBy(orderBy, {
      members: (v) => {
        return {
          usersInGroupChat: {
            _count: v,
          },
        };
      },
    });
    const [chats, count] = await Promise.all([
      this.prismaService.groupChat.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: orderByResult,
        where,
        include: {
          _count: {
            select: {
              messages: true,
              usersInGroupChat: true,
            },
          },
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
      }),
      this.prismaService.groupChat.count({ where }),
    ]);

    const unzippedChats = chats
      .map((chat) => unzipCountFields(chat, ['messages', 'usersInGroupChat']))
      .map((chat) => {
        const { usersInGroupChat, usersInGroupChatCount, ...rest } = chat;

        return { ...rest, membersCount: usersInGroupChatCount };
      });

    return getResponse(unzippedChats, count);
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

    const [result, count] = await Promise.all([
      this.prismaService.groupChat.findMany({
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
      }),
      this.prismaService.groupChat.count({ where }),
    ]);

    const mapped = result.map((groupChat) => {
      const { usersInGroupChat, ...groupChatData } = groupChat;
      const members = usersInGroupChat.map((entry) => entry.user);
      return { ...groupChatData, members };
    });

    return getResponse(mapped, count);
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
