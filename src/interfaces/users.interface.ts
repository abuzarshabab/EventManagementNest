import { Document } from 'mongoose';

export interface UsersI extends Document {
  readonly name: string;
  readonly dob: Date;
  readonly email: string;
  readonly mobileNumber: number;
  password: string;
}
