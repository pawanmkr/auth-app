import { Request, Response } from 'express';
import {
    registerNewUser,
    loginExistingUser,
    checkIfUserExists,
} from '../service/user.service';
import { HttpError } from '../errors/http.error';
import logger from '../utils/logger';

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
        logger.info(`New User Registered: ${user.email}`);
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
            logger.info(`User Logged In: ${email}`);
            res.status(200).json({ token });
        } catch (error) {
            if (error instanceof HttpError) {
                res.status(error.status).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }
}
