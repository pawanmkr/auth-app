import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/http.error';

// This middleware function will catch all errors thrown by the application
// and send an appropriate response to the client.
export const errorHandlingMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof HttpError) {
        res.status(error.status).json({ message: error.message });
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
