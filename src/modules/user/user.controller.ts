import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.model';
import { AtGuard } from '../common/guards';
import { GetCurrentUserId } from '../common/decorators/get-current-user-id.decorator';

@UseGuards(AtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async me(
    @Request() request,
    @GetCurrentUserId() userId: number,
  ): Promise<User> {
    return this.userService.find(userId);
  }
}
