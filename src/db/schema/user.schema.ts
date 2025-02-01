import { text, timestamp } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
    id: uuid('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').unique().notNull(),
    password: text('password').notNull(),
    role: text('role').notNull(),

    // created_at and updated_at can be handled in application layer as well
    // and provides much more flexibility to work with complex situations.
    // Like Daylight saving time, timezones, etc.
    // But for the sake of simplicity, we are using database level timestamps here.
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});
