import { Connection } from 'mongoose';
import { UserSchema } from '../schemas/users.schema';

export const eventsProviders = [
  {
    provide: 'EVENT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
