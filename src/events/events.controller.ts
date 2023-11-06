import {
  Controller,
  Post,
  Body,
  Patch,
  Get,
  Param,
  Request,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import {
  EventI,
  EventUpdateI,
  SearchQueryI,
} from 'src/interfaces/event.interface';
import { Types } from 'mongoose';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async register(@Body() eventInfo: EventI, @Request() req) {
    const user = await this.eventsService.registerEvent(
      eventInfo,
      req.user.userId,
    );
    return user;
  }

  @Get('search')
  async searchEvent(@Query() searchQuery: SearchQueryI) {
    const eventsInfo = await this.eventsService.searchEvent(searchQuery);
    return eventsInfo;
  }

  @Get(':eventId')
  async fetch(@Param('eventId') eventId: Types.ObjectId): Promise<EventI> {
    return await this.eventsService.fetchEvent(eventId);
  }

  @Patch(':eventId')
  async update(
    @Param('eventId') eventId: Types.ObjectId,
    @Body() updateInfo: EventUpdateI,
  ): Promise<any> {
    return await this.eventsService.updateEvent(eventId, updateInfo);
  }

  @Patch(':eventId/join')
  async join(@Param('eventId') eventId: Types.ObjectId, @Request() req: any) {
    console.log(req);
    return await this.eventsService.joinEvent(eventId, req.user);
  }

  @Get('list/:pageNumber')
  async list(@Param('pageNumber') pageNumber: number) {
    const eventsInfo = await this.eventsService.listEvent(pageNumber);
    return eventsInfo;
  }

  @Post('attendees')
  async attendees(@Body() eventInfo: EventI) {
    const user = await this.eventsService.attendeesEvent(eventInfo);
    return user;
  }
}
