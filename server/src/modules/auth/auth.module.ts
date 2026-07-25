import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from '../email/email.module';
import { AuthEmailService } from './auth-email.service';
import { AuthTokenService } from './auth-token.service';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [AuthController],
  providers: [AuthService, AuthEmailService, AuthTokenService],
  exports: [AuthService],
})
export class AuthModule {}
