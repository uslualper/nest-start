import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strategy';

@Module({
  imports: [UserModule, ConfigModule, JwtModule.register({})],
  providers: [AuthService, PrismaService, AtStrategy, RtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
