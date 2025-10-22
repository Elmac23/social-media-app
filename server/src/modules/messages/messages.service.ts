import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { create } from 'domain';
import { CreateMessageDto } from './messages.schema';
import { Query } from 'src/types/query';

@Injectable()
export class MessagesService {
  constructor(private prismaService: PrismaService) {}

  async createMessage(messageDto: CreateMessageDto) {
    const message = await this.prismaService.message.create({
      data: {
        ...messageDto,
      },
    });
    return message;
  }

  async getMessagesByGroupChatId(groupChatId: string, query?: Query) {
    const { limit, page } = query;
    return this.prismaService.message.findMany({
      where: { groupChatId },
      include: { sender: { omit: { hashedPassword: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
