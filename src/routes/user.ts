import express from 'express';
import UserController from '../controller/user.controller';
import { authorizationMiddleware as authorizeRequest } from '../middlewares/authorization.middleware';
import { auditLogger } from '../config/logger';

export const authRouter = express.Router();

// Unprotected Routes
authRouter.post('/register', UserController.registerUser);
authRouter.post('/login', UserController.loginUser);

// Protected Routes
authRouter.get('/user/profile', authorizeRequest, (req, res) => {
    auditLogger.info(`User Profile Accessed: ${req.body.user.email}`);
    res.status(200).json(req.body.user);
});

// Password Reset Routes
authRouter.post('/password/reset/request', UserController.passwordResetRequest);
authRouter.put('/password/reset', UserController.updateUserPassword);
