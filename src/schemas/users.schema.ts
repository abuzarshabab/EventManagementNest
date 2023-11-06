import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Test',
  },
  dob: {
    type: Date,
    default: new Date(),
  },
  email: {
    type: String,
  },
  mobileNumber: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
  },
});
