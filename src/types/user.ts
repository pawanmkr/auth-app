import { user } from '../db/schema/user.schema';
export type User = typeof user.$inferSelect;
