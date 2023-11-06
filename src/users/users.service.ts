import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { UserI } from '../interfaces/users.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<UserI>,
  ) {}

  async userRegistration(userInfo: UserI) {
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

  async userHome(userId: Types.ObjectId) {
    return await this.fetchJoinedAndHostedEvent(userId);
  }

  logoutUser(email: string) {
    return 'User logged out auth header dismantled' + email;
  }

  async fetchJoinedAndHostedEvent(userId: Types.ObjectId): Promise<any> {
    const events = await this.userModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(userId),
        },
      },
      {
        $project: {
          password: 0,
        },
      },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: 'attendees._id',
          as: 'joinedEvents',
        },
      },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: 'hostId',
          as: 'hostedEvents',
        },
      },
    ]);
    console.log(events);

    return events;
  }
}
