import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { SingIn, SingUp } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Tokens } from './types';
import { GetCurrentUser, GetCurrentUserId, Public } from '../common/decorators';
import { RtGuard } from '../common/guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() user: SingIn): Promise<Tokens> {
    return await this.authService.signIn(user);
  }

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() user: SingUp): Promise<Tokens> {
    return await this.authService.signUp(user);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
