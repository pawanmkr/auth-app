import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';

import { verifyToken } from '../utils/token';
import { getUserById } from '../services/user.service';

export const authorizationMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Extract and validate the authorization header
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                message: 'Unauthorized: Missing or malformed token',
            });
            return;
        }

        const token = authHeader.replace('Bearer ', '').trim();
        if (!token) {
            res.status(401).json({
                message: 'Unauthorized: Token not provided',
            });
            return;
        }

        const decoded = verifyToken(token);

        // Check if decoded is a valid JwtPayload and contains the user ID
        if (decoded && typeof decoded === 'object' && 'id' in decoded) {
            const userId = (decoded as JwtPayload).id;
            const user = await getUserById(userId);
            if (!user) {
                res.status(401).json({
                    message: 'Unauthorized: User not found',
                });
                return;
            }
            // remove password & attach user object to request body
            req.body.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
            next();
        } else {
            res.status(401).json({
                message: 'Unauthorized: Invalid token payload',
            });
        }
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            res.status(401).json({
                message: error.message,
            });
            return;
        } else {
            res.status(401).json({
                message: 'invalid token',
            });
            return;
        }
    }
};
