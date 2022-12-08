import { appSchema } from '@nozbe/watermelondb';

import {reminderSchema} from './ReminderSchema';

export const schemas = appSchema({
    version: 2,
    tables: [reminderSchema]

})