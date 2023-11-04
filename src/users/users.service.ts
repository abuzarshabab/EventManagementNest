import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { UsersI } from '../interfaces/users.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<UsersI>,
  ) {}

  async userRegistration(userInfo: UsersI) {
    try {
      const user = await this.userModel.findOne({ email: userInfo.email });
      if (user) throw new BadRequestException('Bad request user already exist');
      userInfo.password = await bcrypt.hash(userInfo.password, 10);
      const newUser = await this.userModel.create(userInfo);
      newUser.password = 'password';
      return newUser;
    } catch (err) {
      console.log('error while  : ', err);
      return { error: 'Error while user Creation' + err };
    }
  }

  async userHome(userId: string) {
    const userInfo = await this.userModel.findOne({
      _id: new Types.ObjectId(userId),
    });
    return userInfo;
  }

  logoutUser(email: string) {
    return 'User logged out auth header dismantled' + email;
  }

  async findOne(email: string) {
    try {
      const user = await this.userModel.findOne({ email: email });

      if (!user) {
        throw new BadRequestException(
          'Bad request password is incorrect, Please try again',
        );
      }

      return user;
    } catch (err) {
      console.log(err);
    }
  }
}
