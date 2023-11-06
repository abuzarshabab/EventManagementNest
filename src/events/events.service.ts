import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
import {
  EventI,
  EventUpdateI,
  SearchQueryI,
} from 'src/interfaces/event.interface';
import { userTokenI } from 'src/interfaces/users.interface';
const PAGE_SIZE = 20;
@Injectable()
export class EventsService {
  constructor(
    @Inject('EVENT_MODEL')
    private eventModel: Model<EventI>,
  ) {}

  async registerEvent(eventInfo: EventI, hostId: Types.ObjectId): Promise<any> {
    try {
      //! We have to wrap validation with joi
      if (
        !eventInfo.openToJoinTill ||
        moment(eventInfo.openToJoinTill).isBefore(moment(new Date()))
      ) {
        throw new BadRequestException({
          error: 'Event join date cannot be the date that is already passed',
          data: eventInfo,
        });
      }

      if (
        !eventInfo.dateOfEvent ||
        moment(eventInfo.dateOfEvent).isBefore(moment(new Date()))
      ) {
        throw new BadRequestException({
          error: 'Event date cannot be the date that is already passed',
          data: eventInfo,
        });
      }

      if (
        moment(eventInfo.dateOfEvent).isBefore(moment(eventInfo.openToJoinTill))
      ) {
        throw new BadRequestException({
          error: 'Event date cannot be the date that is already passed',
          data: eventInfo,
        });
      }

      if (eventInfo.maxAttendees < 0) {
        throw new BadRequestException(
          'Max Attendees limit cannot be less Zero',
        );
      }

      eventInfo.dateOfEvent = new Date(eventInfo.dateOfEvent);
      eventInfo.openToJoinTill = new Date(eventInfo.openToJoinTill);
      eventInfo.hostId = new Types.ObjectId(hostId);

      const event = await this.eventModel.create(eventInfo);
      if (!event) {
        throw new BadRequestException('Event registration failed');
      }
      return { event };
    } catch (error) {
      console.log('Internal server error', error);
      throw new BadRequestException('Internal server error' + error);
    }
  }

  async fetchEvent(eventId: Types.ObjectId): Promise<EventI> {
    const event = await this.eventModel.findOne({
      _id: new Types.ObjectId(eventId),
    });

    if (!event) {
      throw new BadRequestException('Event not found');
    }

    return event;
  }

  async updateEvent(
    eventId: Types.ObjectId,
    updateInfo: EventUpdateI,
  ): Promise<any> {
    try {
      const updatePayload: any = {};

      /* Fetching existing event information */
      const eventInfo = await this.eventModel.findOne({
        _id: new Types.ObjectId(eventId),
      });
      //! We have to wrap validation with joi
      if (!eventInfo) {
        throw new BadRequestException('Event not found');
      }

      if (updateInfo.openToJoinTill) {
        if (moment(updateInfo.openToJoinTill).isBefore(moment())) {
          throw new BadRequestException(
            'Event join date cannot be the date that is already passed',
          );
        }
        updatePayload.openToJoinTill = updateInfo.openToJoinTill;
      }

      if (updateInfo.dateOfEvent) {
        if (moment(updateInfo.dateOfEvent).isBefore(moment())) {
          throw new BadRequestException(
            "Event date cannot be greater than today's date",
          );
        }
        updatePayload.dateOfEvent = updateInfo.dateOfEvent;
      }

      if (updateInfo.maxAttendees) {
        if (updateInfo.maxAttendees < eventInfo.attendees.length) {
          throw new BadRequestException(
            'Max Attendees limit cannot be less than joined attendees',
          );
        }

        updatePayload.maxAttendees = updateInfo.maxAttendees;
      }
      if (updateInfo.location) {
        updatePayload.location = updateInfo.location;
      }

      if (updateInfo.title) {
        updatePayload.title = updateInfo.title;
      }

      if (updateInfo.isEnded != undefined) {
        updatePayload.isEnded = updateInfo.isEnded;
      }

      if (updateInfo.description) {
        updatePayload.description = updateInfo.description;
      }

      if (updateInfo.address) {
        updatePayload.address = updateInfo.address;
      }

      const updateResult = await this.eventModel.findOneAndUpdate(
        { _id: new Types.ObjectId(eventId) },
        { $set: updatePayload },
        { new: true },
      );

      if (!updateResult) {
        throw new BadRequestException(
          'Internal server error, Seems some keys are invalid',
        );
      }

      return updateResult;
    } catch (error) {
      console.log('Internal server error', error);
      throw new BadRequestException(
        'Internal server error, Something went wrong',
      );
    }
  }

  async joinEvent(eventId: Types.ObjectId, userInfo: userTokenI): Promise<any> {
    try {
      /* Fetching existing event information */
      const eventInfo: EventI = await this.eventModel.findOne({
        _id: new Types.ObjectId(eventId),
      });

      if (!eventInfo) {
        throw new BadRequestException(
          'Event not found: Something is wrong with the event you want to join',
        );
      }

      //! We have to wrap validation with joi
      if (eventInfo.attendees.length >= eventInfo.maxAttendees) {
        throw new BadRequestException('Max Attendees limit has been reached');
      }

      if (moment(eventInfo.openToJoinTill).isBefore(moment())) {
        throw new BadRequestException(
          'Sorry for inconvinience, Event joining date has been passed',
        );
      }

      if (!userInfo) {
        throw new BadRequestException('Unable to fetch User information');
      }

      const attendeeInfo = {
        name: userInfo.name,
        _id: userInfo.userId,
        joinDate: new Date(),
      };
      const updateResult = await this.eventModel.findOneAndUpdate(
        { _id: new Types.ObjectId(eventId) },
        {
          $push: {
            attendees: attendeeInfo,
          },
        },
        { new: true },
      );

      return updateResult;
    } catch (error) {
      console.log('Internal server error', error);
      throw new BadRequestException(
        'Internal server error, Something went wrong',
      );
    }
  }

  async listEvent(pageNumber: number): Promise<any> {
    //! First do some validation on Date, MaxAttendee
    pageNumber = pageNumber ? pageNumber - 1 : 0;

    const event = await this.eventModel
      .find()
      .skip(PAGE_SIZE * pageNumber)
      .limit(PAGE_SIZE);
    if (!event) {
      throw new BadRequestException('Event registration failed');
    }

    return event;
  }

  async attendeesEvent(eventInfo: EventI): Promise<any> {
    //! First do some validation on Date, MaxAttendee

    const event = await this.eventModel.create(eventInfo);
    if (!event) {
      throw new BadRequestException('Event registration failed');
    }

    return { event };
  }

  async searchEvent(searchReq: SearchQueryI): Promise<any> {
    const pageNumber = searchReq.pageNumber ? searchReq.pageNumber - 1 : 0;
    let searchQuery: any = {};
    if (searchReq.searchText) {
      searchQuery = {
        $or: [
          { address: { $regex: searchReq.searchText, $options: 'i' } },
          { title: { $regex: searchReq.searchText, $options: 'i' } },
          { description: { $regex: searchReq.searchText, $options: 'i' } },
        ],
      };
    }

    if (searchReq.startDate && searchReq.endDate) {
      searchQuery.dateOfEvent = {
        $gte: new Date(searchReq.startDate),
        $lte: new Date(searchReq.endDate),
      };
    }

    const event = await this.eventModel
      .find(searchQuery)
      .skip(PAGE_SIZE * pageNumber)
      .limit(PAGE_SIZE);
    if (!event) {
      throw new BadRequestException('Event registration failed');
    }

    return event;
  }
}
