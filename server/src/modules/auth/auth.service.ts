import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './auth.schema';
import { ConfigService } from '@nestjs/config';
import { tryOrUndefined } from 'src/utils/try-or-undefined';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { password, deviceId, ...userData } = registerDto;
    const saltRounds = this.configService.get<number>('PASSWORD_SALT', 10);
    const salt = await bcrypt.genSalt(Number(saltRounds));
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await tryOrUndefined(
      this.prismaService.user.create({
        data: {
          ...userData,
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

    if (!user) throw new UnauthorizedException('User already exists');

    return user;
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      return null;
    }
  }

  async refreshToken(token: string) {
    const payload = await this.verifyToken(token);
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

  async confirmLoginSession(deviceId: string) {
    const session = await this.prismaService.loginSession.findUnique({
      where: { id: deviceId },
    });
    if (!session) throw new UnauthorizedException('Session not found');
    await this.prismaService.loginSession.update({
      where: { id: deviceId },
      data: { isVerified: true },
    });
    return { message: 'Session confirmed' };
  }

  async login({
    loginOrEmail,
    password,
    deviceId,
  }: {
    loginOrEmail: string;
    password: string;
    deviceId: string;
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

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const { createdAt, hashedPassword, updatedAt, ...payload } = user;

    if (user.loginSessions.length === 0) {
      await this.prismaService.loginSession.create({
        data: {
          userId: user.id,
          deviceId,
          isVerified: true, // DEV ONLY
        },
      });

      throw new UnauthorizedException(
        'New device detected. Please verify your login.',
      );
    }

    if (!user.loginSessions[0].isVerified) {
      throw new UnauthorizedException(
        'Device not verified. Please confirm your login session.',
      );
    }

    const accessToken = this.jwtService.sign(payload, { expiresIn: '30s' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    return { accessToken, refreshToken };
  }
}
