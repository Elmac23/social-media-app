import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Query,
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
  ConfirmEmailDto,
  confirmEmailSchema,
  ResendConfirmEmailDro,
  resenedConfirmEmailSchema,
  resetPasswordSchema,
  ResetPasswordDto,
} from './auth.schema';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/pipes/ZodValidationPipe';
import { AuthenticationGuard } from 'src/guards/authentication';
import { Request, Response } from 'express';
import { UserId } from 'src/decorators/user-id';
import { DeviceId } from 'src/decorators/device-id';
import { UsersService } from '../users/users.service';
import { AuthEmailService } from './auth-email.service';
import { MINUTE, MONTH } from 'src/utils/timeConstants';
import { AuthTokenService } from './auth-token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private authEmailService: AuthEmailService,
    private authTokenService: AuthTokenService,
  ) {}

  @Post('login')
  async login(
    @Body(new ZodValidationPipe(loginSchema)) body: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @DeviceId() deviceId: string,
  ) {
    console.log(body.otp);
    const { accessToken, refreshToken } = await this.authService.login({
      ...body,
      deviceId,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: MONTH,
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

  @Post('device')
  @HttpCode(204)
  async createDevice(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const deviceId =
      req.cookies['deviceId'] ?? (await this.authService.createDeviceId());

    res.cookie('deviceId', deviceId, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  @Post('register')
  @HttpCode(201)
  async register(
    @Body(new ZodValidationPipe(registerSchema)) registerDto: RegisterDto,
    @DeviceId() deviceId: string,
  ) {
    const user = await this.authService.register({ ...registerDto, deviceId });

    const { email } = user;
    const token = await this.authTokenService.createToken(
      email,
      'CONFIRM_EMAIL',
      15 * MINUTE,
    );
    await this.authEmailService.sendConfirmEmail(user.email, token.token);

    return user;
  }

  @Post('resend-confirm-email')
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(resenedConfirmEmailSchema))
  async resendEmail(@Body() body: ResendConfirmEmailDro) {
    const token = await this.authTokenService.createToken(
      body.email,
      'CONFIRM_EMAIL',
      15 * MINUTE,
    );
    await this.authEmailService.sendConfirmEmail(body.email, token.token);
  }

  @Post('request-reset-password')
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(resenedConfirmEmailSchema))
  async requestResetPassword(@Body() body: ResendConfirmEmailDro) {
    const otp = await this.authTokenService.createOTP(
      body.email,
      'RESET_PASSWORD',
      6,
      15 * MINUTE,
    );
    await this.authEmailService.sendResetPasswordEmail(body.email, otp);
  }

  @Post('request-confirm-device')
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(resenedConfirmEmailSchema))
  async requestConfirmDevice(@Body() body: ResendConfirmEmailDro) {
    const otp = await this.authTokenService.createOTP(
      body.email,
      'CONFIRM_DEVICE',
      6,
      15 * MINUTE,
    );
    await this.authEmailService.sendConfirmDeviceEmail(body.email, otp);
  }

  @Post('reset-password')
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(resetPasswordSchema))
  async resetPassword(@Body() body: ResetPasswordDto) {
    await this.authService.resetPassword(body);
  }

  @Post('confirm-email')
  @UsePipes(new ZodValidationPipe(confirmEmailSchema))
  @HttpCode(201)
  async confirmEmail(@Body() body: ConfirmEmailDto) {
    const { email, token } = body;
    return await this.authService.confirmEmail(email, token);
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
