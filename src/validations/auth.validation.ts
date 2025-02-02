import { z } from 'zod';
import { processRequestBody } from 'zod-express-middleware';

const registerUserSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['user', 'admin']).optional(),
});

const loginUserSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

const passwordResetRequestSchema = z.object({
    email: z.string().email('Invalid email address'),
});

const updateUserPasswordSchema = z.object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters'),
});

export const registerUserValidation = processRequestBody(registerUserSchema);
export const loginUserValidation = processRequestBody(loginUserSchema);
export const passwordResetRequestValidation = processRequestBody(
    passwordResetRequestSchema
);
export const updateUserPasswordValidation = processRequestBody(
    updateUserPasswordSchema
);
