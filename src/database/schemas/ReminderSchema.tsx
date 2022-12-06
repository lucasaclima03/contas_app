import { tableSchema } from '@nozbe/watermelondb/Schema';

export const reminderSchema = tableSchema({
    name: 'reminder',
    columns: [        
        {
            name: 'username',
            type: 'string',
            isOptional: true
        },
        {
            name: 'email',
            type: 'string',
            isOptional: true
        },
        {
            name: 'title',
            type: 'string',
            isOptional: true
        },
        {
            name: 'description',
            type: 'string',
            isOptional: true
        },
        {
            name: 'amount',
            type: 'number',
            isOptional: true
        },
        {
            name: 'reminder_date',
            type: 'string',
            isOptional: true
        },
        {
            name: 'due_date',
            type: 'string',
            isOptional: true
        },
        {
            name: 'payment_proof',
            type: 'string',
            isOptional: true
        },
        {
            name: 'payd',
            type: 'number',
            isOptional: true
        },
        
    ]

})