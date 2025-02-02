import 'dotenv/config';

import { testDbConnection } from './db/drizzle';
import { app } from './app';
import { appLogger } from './config/logger';
import { sendTestEmail } from './config/nodemailer';

const APP_PORT = process.env.APP_PORT;

// Start server
const server = app.listen(APP_PORT, () => {
    appLogger.info('App started successfully!');
    appLogger.info(`🚀 Server running on port ${APP_PORT}`);
    appLogger.info(`🔗 http://localhost:${APP_PORT}`);
    console.log(`🚀 Server running on port ${APP_PORT}`);
    console.log(`🔗 http://localhost:${APP_PORT}`);
});

testDbConnection().then(() => sendTestEmail());

// Handle shutdown gracefully
process.on('SIGINT', () => {
    server.close(() => {
        console.log('👋 Server closed');
        appLogger.info('👋 Server closed');
        process.exit(0);
    });
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    appLogger.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
});
