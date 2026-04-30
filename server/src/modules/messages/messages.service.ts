import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { create } from 'domain';
import { CreateMessageDto, MessageOrderByKeys } from './messages.schema';
import { QueryType, QueryWithOrderedBy } from 'src/types/query';
import getResponse from 'src/utils/getResponse';
import { parseOrderBy } from 'src/utils/parseOrderBy';
import { parseUserWhere } from 'src/utils/parseUserWhere';

@Injectable()
export class MessagesService {
  constructor(private prismaService: PrismaService) {}

  async getUserMessages(
    userId: string,
    { limit, page, search, orderBy }: QueryWithOrderedBy<MessageOrderByKeys>,
  ) {
    const finalWhere = {
      AND: [
        {
          type: 'DEFAULT' as const,
          senderId: userId,
          content: { contains: search, mode: 'insensitive' as const },
        },
      ],
    };

    const orderByResult = parseOrderBy(orderBy, {
      author: (v) => {
        return {
          sender: {
            login: v,
          },
        };
      },
    });

    const [messages, count] = await Promise.all([
      this.prismaService.message.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: finalWhere,
        orderBy: orderByResult,
        include: {
          sender: {
            omit: { hashedPassword: true },
          },
        },
      }),
      this.prismaService.message.count({ where: finalWhere }),
    ]);

    return getResponse(messages, count);
  }

  async getMessageById(id: string) {
    return await this.prismaService.message.findUnique({
      where: {
        id,
      },
      include: {
        groupChat: true,
        sender: {
          omit: {
            hashedPassword: true,
          },
        },
      },
    });
  }

  async getMessages({
    limit,
    page,
    search,
    orderBy,
  }: QueryWithOrderedBy<MessageOrderByKeys>) {
    const where = {
      AND: [
        {
          OR: [
            {
              content: { contains: search, mode: 'insensitive' as const },
            },
            {
              sender: parseUserWhere(search),
            },
          ],
        },
        {
          type: 'DEFAULT' as const,
        },
      ],
    };

    const orderByResult = parseOrderBy(orderBy, {
      author: (v) => {
        return {
          sender: {
            login: v,
          },
        };
      },
    });

    const [messages, count] = await Promise.all([
      this.prismaService.message.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where,
        orderBy: orderByResult,
        include: {
          sender: {
            omit: { hashedPassword: true },
          },
        },
      }),
      this.prismaService.message.count({ where }),
    ]);

    return getResponse(messages, count);
  }

  async createMessage(messageDto: CreateMessageDto) {
    const message = await this.prismaService.message.create({
      data: {
        ...messageDto,
      },
    });
    await this.prismaService.groupChat.update({
      where: { id: messageDto.groupChatId },
      data: { lastMessageAt: message.createdAt },
    });
    return message;
  }

  async getMessagesByGroupChatId(
    groupChatId: string,
    query: QueryWithOrderedBy<MessageOrderByKeys> = {
      limit: 20,
      page: 1,
      orderBy: 'createdAt-desc',
      search: '',
    },
  ) {
    const { limit, page, search, orderBy } = query;

    const orderByResult = parseOrderBy(orderBy, {
      author: (v) => {
        return {
          sender: {
            login: v,
          },
        };
      },
    });

    const where = {
      AND: [
        {
          groupChatId,
        },
        {
          OR: [
            {
              content: { contains: search, mode: 'insensitive' as const },
            },
            {
              sender: parseUserWhere(search),
            },
          ],
        },
      ],
    };

    const messages = await this.prismaService.message.findMany({
      where,
      include: { sender: { omit: { hashedPassword: true } } },
      orderBy: orderByResult,
      skip: (page - 1) * limit,
      take: limit,
    });
    const count = await this.prismaService.message.count({
      where,
    });

    return getResponse(messages, count);
  }
}
