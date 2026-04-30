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
import { UserOrderByKeys } from '../users/user.schema';
import { parseUserWhere } from 'src/utils/parseUserWhere';

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

  async getMembers(
    groupChatId: string,
    query: QueryWithOrderedBy<UserOrderByKeys> = {
      limit: 20,
      page: 1,
      search: '',
      orderBy: 'id-asc',
    },
  ) {
    const orderBy = parseOrderBy(query.orderBy, {
      lastName: (v) => {
        return {
          lastname: v,
        };
      },
    });

    const where = {
      AND: [
        {
          userInGroupChat: {
            some: {
              groupChatId,
            },
          },
        },
        parseUserWhere(query.search),
      ],
    };
    const data = await this.prismaService.user.findMany({
      orderBy,
      take: query.limit,
      skip: (query.page - 1) * query.limit,
      where,
    });

    const count = await this.prismaService.user.count({
      where,
    });

    return getResponse(data, count);
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
      messages: (v) => {
        return {
          messages: {
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

    const unzippedChats = chats.map((chat) =>
      unzipCountFields(chat, ['messages', 'usersInGroupChat']),
    );

    return getResponse(unzippedChats, count);
  }

  async getUsersGroupChats(
    userId: string,
    query: QueryWithOrderedBy<GroupChatOrderByKeys> = {
      limit: 20,
      page: 1,
      orderBy: 'lastMessageAt-desc',
    },
  ) {
    const { orderBy, limit, page, search } = query;
    const where = {
      AND: [
        {
          OR: [
            {
              name: { contains: search, mode: 'insensitive' as const },
            },
            {
              id: { contains: search, mode: 'insensitive' as const },
            },
          ],
        },
        {
          usersInGroupChat: {
            some: {
              userId: userId,
            },
          },
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
      messages: (v) => {
        return {
          messages: {
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
          messages: {
            include: {
              sender: true,
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

        return {
          ...rest,
          membersCount: usersInGroupChatCount,
          members: usersInGroupChat.map((member) => member.user),
        };
      });

    return getResponse(unzippedChats, count);
  }

  async getGroupChatById(groupChatId: string) {
    const { usersInGroupChat, ...groupData } =
      await this.prismaService.groupChat.findUnique({
        where: { id: groupChatId },
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
      });

    const unzippedGroupChatData = unzipCountFields(groupData, [
      'messages',
      'usersInGroupChat',
    ]);

    return {
      ...unzippedGroupChatData,
      members: usersInGroupChat.map((u) => u.user),
    };
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
