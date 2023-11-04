import { Controller, Post, Body, Patch, Get } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventI } from 'src/interfaces/event.interface';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('register')
  async register(@Body() eventInfo: EventI) {
    const user = await this.eventsService.registerEvent(eventInfo);
    return user;
  }

  @Patch('update')
  async update(@Body() eventInfo: EventI) {
    const user = await this.eventsService.updateEvent(eventInfo);
    return user;
  }

  @Patch('join')
  async join(@Body() eventInfo: EventI) {
    const user = await this.eventsService.joinEvent(eventInfo);
    return user;
  }

  @Get('list')
  async list(@Body() eventInfo: EventI) {
    const user = await this.eventsService.listEvent(eventInfo);
    return user;
  }

  @Post('attendees')
  async attendees(@Body() eventInfo: EventI) {
    const user = await this.eventsService.attendeesEvent(eventInfo);
    return user;
  }
}
