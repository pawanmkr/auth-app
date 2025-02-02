import express from 'express';
import UserController from '../controller/user.controller';
import authLimiter from '../middlewares/rate_limiter.middleware';
import { authorizationMiddleware as authorizeRequest } from '../middlewares/authorization.middleware';
import {
    loginUserValidation,
    registerUserValidation,
    passwordResetRequestValidation,
    updateUserPasswordValidation,
} from '../validations/auth.validation';
import onlyAdminsAllowed from '../middlewares/admin.middleware';

export const authRouter = express.Router();

authRouter
    // Unprotected Routes
    .post(
        '/register',
        authLimiter,
        registerUserValidation,
        UserController.registerUser
    )
    .post('/login', authLimiter, loginUserValidation, UserController.loginUser)

    // Protected Routes
    .get('/user/profile', authorizeRequest, UserController.getUserProfile)

    // Password Reset Routes
    .post(
        '/password/reset/request',
        authLimiter,
        authorizeRequest,
        onlyAdminsAllowed, // Only Admins can request password reset
        passwordResetRequestValidation,
        UserController.passwordResetRequest
    )
    .put(
        '/password/reset',
        authLimiter,
        authorizeRequest,
        onlyAdminsAllowed, // Only Admins can request password reset
        updateUserPasswordValidation,
        UserController.updateUserPassword
    );
