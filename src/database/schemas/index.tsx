import { appSchema } from '@nozbe/watermelondb';

import {reminderSchema} from './ReminderSchema';

export const schemas = appSchema({
    version: 1,
    tables: [reminderSchema]

})