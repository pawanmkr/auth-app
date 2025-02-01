import pino from 'pino';
import fs from 'fs';
import path from 'path';
import { envSchema } from '../config/env';

// Get absolute path of logs directory parallel to src
const logsDir = path.resolve(process.cwd(), 'logs');

// Create the logs directory if it doesn't exist
fs.mkdirSync(logsDir, { recursive: true });

// Create a writable file stream for access logs
export const accessLogStream = fs.createWriteStream(
    path.join(logsDir, 'access.log'),
    { flags: 'a' }
);

// Create a writable file stream for audit logs
const auditLogStream = fs.createWriteStream(path.join(logsDir, 'audit.log'), {
    flags: 'a',
});

const logger = pino(
    {
        level: envSchema.LOG_LEVEL,
        timestamp: pino.stdTimeFunctions.isoTime,
        formatters: {
            level: (label) => ({ level: label }),
        },
    },
    auditLogStream
);

export default logger;
