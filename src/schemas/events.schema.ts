import { Types, Schema } from 'mongoose';

export const EventSchema = new Schema({
  hostId: {
    type: Types.ObjectId,
  },
  attendees: {
    type: [{ name: String, _id: Types.ObjectId, joinDate: Date }],
    default: [],
  },
  title: {
    type: String,
  },
  openToJoinTill: {
    type: Date,
  },
  dateOfEvent: {
    type: Date,
  },
  isEnded: {
    type: Boolean,
  },
  maxAttendees: {
    type: Number,
    default: 200,
  },
  description: {
    type: String,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: false,
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
      required: false,
    },
  },
  address: {
    type: String,
    requred: true,
  },
});
