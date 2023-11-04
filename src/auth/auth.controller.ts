import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './constants';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Delete('logout')
  logout(@Request() req) {
    return this.authService.signOut(req.user);
  }
}
