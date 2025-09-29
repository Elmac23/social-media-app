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
    const { password, ...userData } = registerDto;
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

  async login({
    loginOrEmail,
    password,
  }: {
    loginOrEmail: string;
    password: string;
  }) {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ login: loginOrEmail }, { email: loginOrEmail }],
      },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const { createdAt, hashedPassword, updatedAt, ...payload } = user;

    const accessToken = this.jwtService.sign(payload, { expiresIn: '30s' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    return { accessToken, refreshToken };
  }
}
