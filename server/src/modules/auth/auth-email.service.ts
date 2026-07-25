import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { AuthTokenService } from './auth-token.service';

@Injectable({})
export class AuthEmailService {
  constructor(
    private emailService: EmailService,
    private prismaService: PrismaService,
    private configService: ConfigService,
    private authTokenService: AuthTokenService,
  ) {}

  async sendConfirmEmail(email: string, token: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user)
      throw new NotFoundException(`User with email: ${email} was not found!`);

    await this.emailService.sendEmail(user.email, 'CONFIRM_EMAIL', {
      login: user.login,
      confirmUrl: `${this.configService.get('CLIENT_URL')}/auth/confirm-email/confirm?token=${token}&email=${email}`,
    });
  }

  async sendResetPasswordEmail(email: string, otp: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return;

    await this.emailService.sendEmail(user.email, 'RESET_PASSWORD', {
      login: user.login,
      otp,
    });
  }

  async sendConfirmDeviceEmail(email: string, otp: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return;

    await this.emailService.sendEmail(user.email, 'CONFIRM_DEVICE', {
      login: user.login,
      otp,
    });
  }
}
