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
    reminder_date: Date

    @field('due_date')
    due_date: Date

    @field('payment_proof')
    payment_proof: string 

    @field('payd')
    payd: number
}