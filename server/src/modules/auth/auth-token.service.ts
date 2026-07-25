import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { Token, TokenType } from 'generated/prisma';
import { v4 as uuid } from 'uuid';
import { generateOTP } from 'src/utils/generateOpt';
import * as bcrypt from 'bcrypt';
import { MINUTE } from 'src/utils/timeConstants';

@Injectable({})
export class AuthTokenService {
  constructor(private prismaService: PrismaService) {}

  async createToken(
    email: string,
    tokenType: TokenType,
    expiresIn: number,
    token?: string,
  ) {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const existingToken = await this.prismaService.token.upsert({
      where: {
        userId_type: {
          type: tokenType,
          userId: user.id,
        },
      },
      create: {
        expiresAt: new Date(Date.now() + expiresIn),
        token: token ?? uuid(),
        userId: user.id,
        type: tokenType,
      },
      update: {
        token,
        expiresAt: new Date(Date.now() + expiresIn),
      },
    });

    return existingToken;
  }

  async createOTP(
    email: string,
    type: TokenType,
    length: number = 6,
    expiresIn: number,
  ) {
    const otp = generateOTP(length);
    const hashedOtp = await bcrypt.hash(otp, 10);
    await this.createToken(email, type, expiresIn, hashedOtp);
    return otp;
  }

  async verifyOTPwithMail(email: string, type: TokenType, otp: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        tokens: {
          where: {
            type,
            usedAt: undefined,
            expiresAt: {
              gt: new Date(),
            },
          },
        },
      },
    });

    if (!user) return false;
    if (user.tokens.length === 0) return false;

    return await bcrypt.compare(otp, user.tokens[0].token);
  }

  async verifyToken(userId: string, type: TokenType, userToken: string) {
    const token = await this.prismaService.token.findUnique({
      where: {
        userId_type: {
          userId: userId,
          type,
        },
        token: userToken,
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    return !!token;
  }

  async verifyTokenWithEmail(
    email: string,
    type: TokenType,
    userToken: string,
  ) {
    const token = await this.prismaService.token.findFirst({
      where: {
        type,
        user: {
          email,
        },
        token: userToken,
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    return !!token;
  }

  async verifyOTP(userId: string, type: TokenType, otp: string) {
    const token = await this.prismaService.token.findUnique({
      where: {
        userId_type: {
          userId: userId,
          type,
        },
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!token) return false;

    return await bcrypt.compare(otp, token.token);
  }

  async setTokenUsed(email: string, type: TokenType) {
    await this.prismaService.token.updateMany({
      where: {
        user: {
          email,
        },
        type,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }
}
