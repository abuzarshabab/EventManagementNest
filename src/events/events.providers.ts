import { Connection } from 'mongoose';
import { EventSchema } from '../schemas/events.schema';

export const eventsProviders = [
  {
    provide: 'EVENT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Event', EventSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
