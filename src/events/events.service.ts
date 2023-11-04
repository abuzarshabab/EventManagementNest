import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { EventI } from 'src/interfaces/event.interface';

@Injectable()
export class EventsService {
  constructor(
    @Inject('EVENT_MODEL')
    private eventModel: Model<EventI>,
  ) {}

  async registerEvent(eventInfo: EventI): Promise<any> {
    //! First do some validation on Date, MaxAttendee

    const event = await this.eventModel.create(eventInfo);
    if (!event) {
      throw new BadRequestException('Event registration failed');
    }

    return { event };
  }

  async updateEvent(eventInfo: EventI): Promise<any> {
    //! First do some validation on Date, MaxAttendee

    const event = await this.eventModel.create(eventInfo);
    if (!event) {
      throw new BadRequestException('Event registration failed');
    }

    return { event };
  }

  async joinEvent(eventInfo: EventI): Promise<any> {
    //! First do some validation on Date, MaxAttendee

    const event = await this.eventModel.create(eventInfo);
    if (!event) {
      throw new BadRequestException('Event registration failed');
    }

    return { event };
  }

  async listEvent(eventInfo: EventI): Promise<any> {
    //! First do some validation on Date, MaxAttendee

    const event = await this.eventModel.create(eventInfo);
    if (!event) {
      throw new BadRequestException('Event registration failed');
    }

    return { event };
  }

  async attendeesEvent(eventInfo: EventI): Promise<any> {
    //! First do some validation on Date, MaxAttendee

    const event = await this.eventModel.create(eventInfo);
    if (!event) {
      throw new BadRequestException('Event registration failed');
    }

    return { event };
  }
}
