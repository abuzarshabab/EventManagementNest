import { Document, Types } from 'mongoose';

export interface EventI extends Document {
  title: string;
  openToJoinTill: Date;
  dateOfEvent: Date;
  isEnded: boolean;
  attendees: [];
  hostId: Types.ObjectId;
  maxAttendees: number;
  description: string;
  location: {
    coordinates: [];
  };
  address: string;
}

export interface EventUpdateI extends Document {
  title?: string;
  openToJoinTill?: Date;
  dateOfEvent?: Date;
  isEnded?: boolean;
  attendees?: [];
  maxAttendees?: number;
  description?: string;
  location?: string;
  address?: string;
}

export interface SearchQueryI extends Document {
  startDate?: Date;
  endDate?: Date;
  searchText?: string;
  address?: string;
  pageNumber?: number;
}
