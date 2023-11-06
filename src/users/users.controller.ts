import { Controller, Post, Body, Get, Request } from '@nestjs/common';
import { UserI } from 'src/interfaces/users.interface';
import { UsersService } from './users.service';
import { Public } from 'src/auth/constants';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Public()
  @Post('register')
  async registerUser(@Body() userInfo: UserI) {
    const user = await this.userService.userRegistration(userInfo);
    return user;
  }

  @Get('home')
  async userHome(@Request() req) {
    const home = await this.userService.userHome(req.user.userId);
    return home;
  }
}
