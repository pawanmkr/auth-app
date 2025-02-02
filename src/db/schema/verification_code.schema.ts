import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './user.schema';

export const verificationCode = pgTable('verification_code', {
    id: uuid('id').primaryKey(),
    code: text('code').notNull().unique(),
    requestedFor: text('requested_for').notNull(),
    requestedBy: uuid('requested_by')
        .notNull()
        .references(() => user.id),
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});
