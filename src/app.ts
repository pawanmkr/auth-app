import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';

import { accessLogStream } from './config/logger';
import { authRouter } from './routes/user';
import { errorHandlingMiddleware } from './middlewares/error_handler.middleware';
import { envSchema } from './config/env';

export const app = express();
const csrfProtection = csurf({ cookie: true });

// Middlewares
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());
app.use(
    cors({
        origin: '*', // Explicitly set allowed origin in [] for production
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
        credentials: true, // Enable cookies across requests
    })
);
app.use(errorHandlingMiddleware);
app.disable('x-powered-by'); // Disable the X-Powered-By header, So that the attacker can't know the technology stack
if (envSchema.NODE_ENV !== 'test') {
    app.use(csrfProtection);
} else {
    console.log('CSRF protection disabled in test environment');
}
// Requet Logger Middleware
app.use(morgan('combined', { stream: accessLogStream })); // Combined log format with log file
app.use(morgan('dev')); // Dev log format with console

/**
 * Routes
 *
 * 1. Health Check Endpoint: Use this endpoint to check if the server is up and running
 * 2. CSRF Token Endpoint: Use this endpoint to get the CSRF token before making POST requests
 * 3. Auth Routes: All routes related to user authentication
 */
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is up and running' });
});

app.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

app.use('/api/v1/auth', authRouter);
