import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { appLogger } from '../config/logger';
import { sql } from 'drizzle-orm';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle({ client: pool });

// Database connection test
export async function testDbConnection() {
    try {
        await db.execute(sql`SELECT 1`);
        console.log('✅ Database connection successful');
        appLogger.info('✅ Database connection successful');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        appLogger.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}
