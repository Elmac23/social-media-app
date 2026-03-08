import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { create } from 'domain';
import { CreateMessageDto, MessageOrderByKeys } from './messages.schema';
import { QueryType, QueryWithOrderedBy } from 'src/types/query';
import getResponse from 'src/utils/getResponse';
import { parseOrderBy } from 'src/utils/parseOrderBy';

@Injectable()
export class MessagesService {
  constructor(private prismaService: PrismaService) {}

  async getMessages({
    limit,
    page,
    search,
    orderBy,
  }: QueryWithOrderedBy<MessageOrderByKeys>) {
    let where = {};

    if (search.split(' ').length === 1) {
      where = {
        OR: [
          {
            sender: {
              OR: [
                { login: { contains: search, mode: 'insensitive' } },
                { id: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
                { lastname: { contains: search, mode: 'insensitive' } },
              ],
            },
          },
          {
            content: { contains: search, mode: 'insensitive' },
          },
        ],
      };
    } else if (search.split(' ').length === 2) {
      const names = search.split(' ');
      const firstName = names[0];
      const lastName = names[1];

      where = {
        OR: [
          { content: { contains: search, mode: 'insensitive' } },
          {
            sender: {
              OR: [
                {
                  AND: [
                    { name: { contains: firstName, mode: 'insensitive' } },
                    { lastname: { contains: lastName, mode: 'insensitive' } },
                  ],
                },
                {
                  AND: [
                    { name: { contains: lastName, mode: 'insensitive' } },
                    {
                      lastname: { contains: firstName, mode: 'insensitive' },
                    },
                  ],
                },
              ],
            },
          },
        ],
      };
    } else {
      where = {
        content: { contains: search, mode: 'insensitive' },
      };
    }

    const finalWhere = {
      AND: [
        where,
        {
          type: 'DEFAULT',
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

  async getMessagesByGroupChatId(groupChatId: string, query?: QueryType) {
    const { limit, page } = query;
    const messages = await this.prismaService.message.findMany({
      where: { groupChatId },
      include: { sender: { omit: { hashedPassword: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
    const count = await this.prismaService.message.count({
      where: { groupChatId },
    });

    return getResponse(messages, count);
  }
}
