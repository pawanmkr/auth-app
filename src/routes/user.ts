import express from 'express';
import UserController from '../controller/user.controller';
import { authorizationMiddleware as authorizeRequest } from '../middlewares/authorization.middleware';
import logger from '../utils/logger';

export const authRouter = express.Router();

// Unprotected Routes
authRouter.post('/register', UserController.registerUser);
authRouter.post('/login', UserController.loginUser);

// Protected Routes
authRouter.get('/user/profile', authorizeRequest, (req, res) => {
    logger.info(`User Profile Accessed: ${req.body.user.email}`);
    res.status(200).json(req.body.user);
});
