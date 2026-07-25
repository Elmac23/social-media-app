import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, ResetPasswordDto } from './auth.schema';
import { ConfigService } from '@nestjs/config';
import { tryOrUndefined } from 'src/utils/try-or-undefined';
import { capitalizeFirstLetter } from 'src/utils/capitalize';
import { v4 as uuid } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import { Prisma, TokenType } from 'generated/prisma';
import { generateOTP } from 'src/utils/generateOpt';
import { AuthEmailService } from './auth-email.service';
import { AuthTokenService } from './auth-token.service';
import { MINUTE } from 'src/utils/timeConstants';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private authEmailService: AuthEmailService,
    private authTokenService: AuthTokenService,
  ) {}

  async confirmEmail(email: string, token: string) {
    const tokenResult = await this.authTokenService.verifyTokenWithEmail(
      email,
      'CONFIRM_EMAIL',
      token,
    );

    if (!tokenResult) throw new UnauthorizedException('Invalid token provided');

    const user = await this.prismaService.user.update({
      where: {
        email,
      },
      data: {
        emailConfirmedAt: new Date(),
      },
    });

    if (!user)
      throw new NotFoundException(
        'User corelated with this token doesnt exist',
      );
  }

  async register(registerDto: RegisterDto) {
    const { password, deviceId, name, lastname, ...userData } = registerDto;
    const saltRounds = this.configService.get<number>('PASSWORD_SALT', 10);
    const salt = await bcrypt.genSalt(Number(saltRounds));
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await tryOrUndefined(
      this.prismaService.user.create({
        data: {
          ...userData,
          name: capitalizeFirstLetter(name),
          lastname: capitalizeFirstLetter(lastname),
          hashedPassword,
          userData: {
            create: {},
          },
          privacy: { create: {} },
          loginSessions: {
            create: {
              isVerified: true,
              deviceId,
            },
          },
        },
      }),
    );

    if (!user) throw new UnauthorizedException('Login or email is occupied!');

    return user;
  }

  async resetPassword(data: ResetPasswordDto) {
    const { email, otp, password } = data;
    const saltRounds = this.configService.get<number>('PASSWORD_SALT', 10);
    const salt = await bcrypt.genSalt(Number(saltRounds));
    const hashedPassword = await bcrypt.hash(password, salt);

    const otpResult = await this.authTokenService.verifyOTPwithMail(
      email,
      'RESET_PASSWORD',
      otp,
    );

    if (!otpResult) throw new UnauthorizedException('Invalid OTP');

    await this.authTokenService.setTokenUsed(email, 'RESET_PASSWORD');

    await this.prismaService.user.update({
      where: {
        email,
      },
      data: {
        hashedPassword,
      },
    });
  }

  async verifyTokenJWT(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      return null;
    }
  }

  async refreshToken(token: string) {
    const payload = await this.verifyTokenJWT(token);
    if (!payload) throw new UnauthorizedException('Invalid token');
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.id },
    });
    if (!user) throw new UnauthorizedException('User not found');
    const { createdAt, hashedPassword, updatedAt, ...newPayload } = user;
    const accessToken = this.jwtService.sign(newPayload, { expiresIn: '30s' });
    return { accessToken };
  }

  async getMe(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new UnauthorizedException('User not found');
    const { hashedPassword, updatedAt, createdAt, ...userData } = user;
    return userData;
  }

  async createDeviceId() {
    const deviceId = uuid();
    return deviceId;
  }

  async confirmLoginSession(userId: string, deviceId: string) {
    console.log('SESSION: ', deviceId);
    const session = await this.prismaService.loginSession.findUnique({
      where: {
        userId_deviceId: {
          deviceId,
          userId,
        },
      },
    });
    if (!session) throw new UnauthorizedException('Session not found');
    await this.prismaService.loginSession.update({
      where: {
        userId_deviceId: {
          deviceId,
          userId,
        },
      },
      data: { isVerified: true },
    });
    return { message: 'Session confirmed' };
  }

  async login({
    loginOrEmail,
    password,
    deviceId,
    otp,
  }: {
    loginOrEmail: string;
    password: string;
    deviceId: string;
    otp?: string;
  }) {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ login: loginOrEmail }, { email: loginOrEmail }],
      },
      include: {
        loginSessions: {
          where: {
            deviceId: deviceId,
          },
        },
      },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!user.emailConfirmedAt)
      throw new ForbiddenException({
        code: 'EMAIL_NOT_VERIFIED',
        email: user.email,
        message: 'Please verify your email',
      });

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const { createdAt, hashedPassword, updatedAt, ...payload } = user;

    if (user.loginSessions.length === 0) {
      await this.prismaService.loginSession.create({
        data: {
          userId: user.id,
          deviceId,
          isVerified: true, // DEV
        },
      });

      const otp = await this.authTokenService.createOTP(
        user.email,
        'CONFIRM_DEVICE',
        6,
        15 * MINUTE,
      );

      await this.authEmailService.sendConfirmDeviceEmail(user.email, otp);

      throw new ForbiddenException({
        message: 'New device detected. Please verify your login.',
        code: 'DEVICE_NOT_VERIFIED',
      });
    }

    if (!user.loginSessions[0].isVerified) {
      if (!otp) {
        const otp = await this.authTokenService.createOTP(
          user.email,
          'CONFIRM_DEVICE',
          6,
          15 * MINUTE,
        );

        await this.authEmailService.sendConfirmDeviceEmail(user.email, otp);
        throw new UnauthorizedException({
          message: 'New device detected. Please verify your login.',
          code: 'DEVICE_NOT_VERIFIED',
        });
      }

      const otpResult = await this.authTokenService.verifyOTP(
        user.id,
        'CONFIRM_DEVICE',
        otp,
      );

      if (!otpResult) throw new UnauthorizedException('Invalid OTP');

      await this.authTokenService.setTokenUsed(user.email, 'CONFIRM_DEVICE');
      await this.confirmLoginSession(user.id, deviceId);
    }

    const accessToken = this.jwtService.sign(payload, { expiresIn: '30s' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    return { accessToken, refreshToken };
  }
}
