import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  email: String,
  mobileNumber: Number,
  password: String,
});
