import {
  Injectable,
  UnauthorizedException,
  Inject,
  BadRequestException,
} from '@nestjs/common';

import { UsersI } from '../interfaces/users.interface';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<UsersI>,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, inputPassword: string): Promise<any> {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isValidPassword = await bcrypt.compare(inputPassword, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException();
    }

    const payload = {
      email: user.email,
      userId: user._id,
      mobileNumber: user.mobileNumber,
      name: user.name,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  async signOut(user): Promise<any> {
    if (user?.name) {
      return {
        message: `Your session is terminated successfully ${user.name}`,
      };
    }
    throw new UnauthorizedException('User is invalid or session expired');
  }
}
