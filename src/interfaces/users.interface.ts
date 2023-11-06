import { Document, Types } from 'mongoose';

export interface UserI extends Document {
  readonly name: string;
  readonly dob: Date;
  readonly email: string;
  readonly mobileNumber: number;
  password: string;
}

export interface userTokenI extends Document {
  readonly name?: string;
  readonly email?: string;
  readonly mobileNumber?: number;
  readonly userId?: Types.ObjectId;
}
