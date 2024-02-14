import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { SingIn, SingUp } from './dto/auth.dto';
import { JwtPayload, Tokens } from './types';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from 'src/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async signIn(userData: SingIn): Promise<Tokens> {
    const user = await this.userService.findByEmail(userData.email);

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await bcrypt.compare(
      userData.password,
      user.password,
    );

    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async signUp(userData: SingUp): Promise<Tokens> {
    const user = await this.userService.findByEmail(userData.email);
    if (user) {
      throw new Error('User already exists');
    }

    const securityConfig = this.configService.get<SecurityConfig>('security');

    userData.password = await bcrypt.hash(
      userData.password,
      securityConfig.bcryptSaltOrRound,
    );

    const newUser = await this.userService.createUser(userData);

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRtHash(newUser.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number): Promise<boolean> {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        refreshToken: {
          not: null,
        },
      },
      data: {
        refreshToken: null,
      },
    });
    return true;
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    const securityConfig = this.configService.get<SecurityConfig>('security');

    const hash = await bcrypt.hash(rt, securityConfig.bcryptSaltOrRound);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hash,
      },
    });
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.refreshToken);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const securityConfig = this.configService.get<SecurityConfig>('security');

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: securityConfig.accessSecret,
        expiresIn: securityConfig.accessExpiresIn,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: securityConfig.refreshSecret,
        expiresIn: securityConfig.refreshExpiresIn,
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
