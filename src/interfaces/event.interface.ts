import { Document, Types } from 'mongoose';

export interface EventI extends Document {
  name: string;
  date: Date;
  isEnded: boolean;
  attendees: [];
  hostId: Types.ObjectId;
}
