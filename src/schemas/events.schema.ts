import * as mongoose from 'mongoose';

export const EventSchema = new mongoose.Schema({
  name: String,
  date: Date,
  isEnded: Boolean,
  attendees: Array,
  hostId: mongoose.Types.ObjectId,
});
