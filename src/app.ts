import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { accessLogStream } from './utils/logger';
import { authRouter } from './routes/user';
import { errorHandlingMiddleware } from './middlewares/error_handler.middleware';

export const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);
app.use(errorHandlingMiddleware);

// Requet Logger Middleware
app.use(morgan('combined', { stream: accessLogStream })); // Combined log format with log file
app.use(morgan('dev')); // Dev log format with console

// Health Check
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is up and running' });
});

// Routes
app.use('/api/v1/auth', authRouter);
