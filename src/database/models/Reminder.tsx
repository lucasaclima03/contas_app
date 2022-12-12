import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class ReminderModel extends Model {
    static table = 'reminder'    

    @field('username')
    username: string    

    @field('email')
    email: string

    @field('title')
    title: string

    @field('description')
    description: string

    @field('amount')
    amount: number

    @field('reminder_date')
    reminder_date: string

    @field('due_date')
    due_date: string

    @field('payment_proof')
    payment_proof: string 

    @field('payd')
    payd: number

    @field('event_id')
    event_id: number

    @field('day')
    day: number

    @field('month')
    month: number

    @field('year')
    year: number

    @field('hours')
    hours: number

    @field('minutes')
    minutes: number

    @field('previous_id')
    previous_id: number


}