import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  loginSchema,
  LoginDto,
  registerSchema,
  RegisterDto,
} from './auth.schema';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/pipes/ZodValidationPipe';
import { AuthenticationGuard } from 'src/guards/authentication';
import { Request, Response } from 'express';
import { UserId } from 'src/decorators/user-id';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res) {
    const { accessToken, refreshToken } = await this.authService.login(body);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  @Post('refresh')
  async refreshToken(@Req() req: Request) {
    const { refreshToken: body } = req.cookies;

    if (!body) return { accessToken: null };
    const { accessToken } = await this.authService.refreshToken(body);

    return { accessToken };
  }

  @Post('register')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Get('me')
  @UseGuards(AuthenticationGuard)
  async me(@UserId() userId: string) {
    if (!userId) throw new BadRequestException('User ID not found');

    return await this.authService.getMe(userId);
  }

  @Post('logout')
  @HttpCode(201)
  @UseGuards(AuthenticationGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken');
    return {};
  }
}
