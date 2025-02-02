import { Request, Response } from 'express';

import {
    registerNewUser,
    loginExistingUser,
    checkIfUserExists,
    checkIfCodeIsValid,
    updateUserPassword,
    generateVerificationCode,
    getUserByEmail,
} from '../services/user.service';
import { HttpError } from '../errors/http.error';
import { auditLogger } from '../config/logger';
import { envSchema } from '../config/env';
import { sendMail } from '../config/nodemailer';

export default class UserController {
    static async registerUser(req: Request, res: Response) {
        const { name, email, password, role } = req.body;
        const userAlreadyExists = await checkIfUserExists(email);
        if (userAlreadyExists) {
            res.status(409).json({
                message: 'User Already Exists',
            });
            return;
        }
        const user = await registerNewUser(
            name,
            email,
            password,
            role || 'user'
        );
        auditLogger.info(`New User Registered: ${user.email}`);
        res.status(201).json(user);
    }

    static async loginUser(req: Request, res: Response) {
        const { email, password } = req.body;
        const userAlreadyExists = await checkIfUserExists(email);
        if (!userAlreadyExists) {
            res.status(404).json({
                message: 'User Not Found, Please Register the User',
            });
            return;
        }
        try {
            const token = await loginExistingUser(email, password);
            auditLogger.info(`User Logged In: ${email}`);
            res.status(200).json({ token });
        } catch (error) {
            if (error instanceof HttpError) {
                res.status(error.status).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }

    static async passwordResetRequest(req: Request, res: Response) {
        const { email } = req.body;
        const user = await getUserByEmail(email);
        console.log(user);
        if (!user) {
            res.status(404).json({
                message: 'User Not Found, Please Register the User',
            });
            return;
        }
        const code = await generateVerificationCode('password_reset', user.id);
        const subject = 'Password Reset Request';
        const message = `Please make a POST request on below api with new password. ${envSchema.APP_URL}/api/v1/auth/password/reset?code=${code}`;
        await sendMail(email, subject, message);
        auditLogger.info(`Password Reset Email Sent: ${email}`);
        res.status(200).json({
            message: 'Please check your email to reset the password',
        });
    }

    static async updateUserPassword(req: Request, res: Response) {
        const code = req.query.code as string;
        const { newPassword, confirmPassword } = req.body;
        if (newPassword !== confirmPassword) {
            res.status(400).json({ message: 'Passwords do not match' });
            return;
        }
        const { isCodeValid, requestedBy, requestedFor } =
            await checkIfCodeIsValid(code);
        if (!isCodeValid || requestedFor !== 'password_reset') {
            res.status(400).json({ message: 'Invalid Request' });
            return;
        }
        await updateUserPassword(newPassword, requestedBy);
        auditLogger.info(`Password Reset Successful: ${requestedBy}`);
        res.status(200).json({ message: 'Password Reset Successful' });
    }
}
