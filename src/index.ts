import 'dotenv/config';
import { sql } from 'drizzle-orm';

import { db } from './db/drizzle';
import { app } from './app';

const APP_PORT = process.env.APP_PORT;

// Start server
const server = app.listen(APP_PORT, () => {
    console.log(`🚀 Server running on port ${APP_PORT}`);
    console.log(`🔗 http://localhost:${APP_PORT}`);
});

// Database connection test
async function testDbConnection() {
    try {
        await db.execute(sql`SELECT 1`);
        console.log('✅ Database connection successful');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}
testDbConnection();

// Handle shutdown gracefully
process.on('SIGINT', () => {
    server.close(() => {
        console.log('👋 Server closed');
        process.exit(0);
    });
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
});
