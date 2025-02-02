import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { v7 as uuidv7, v4 as uuidv4 } from 'uuid';

import { db } from '../db/drizzle';
import { User } from '../types/user';
import { user } from '../db/schema/user.schema';
import { generateToken } from '../utils/token';
import { HttpError } from '../errors/http.error';
import { verificationCode } from '../db/schema/verification_code.schema';
import { envSchema } from '../config/env';

export async function registerNewUser(
    name: string,
    email: string,
    password: string,
    role: string
): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const savedUser = await db
        .insert(user)
        .values({
            id: uuidv7(),
            name,
            email,
            password: hashedPassword,
            role,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })
        .returning({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        })
        .execute();
    return savedUser[0];
}

export async function getUserByEmail(email: string): Promise<User> {
    return (await db.select().from(user).where(eq(user.email, email)))[0];
}

export async function getUserById(id: string): Promise<User> {
    return (await db.select().from(user).where(eq(user.id, id)))[0];
}

export async function checkIfUserExists(email: string): Promise<boolean> {
    const user = await getUserByEmail(email);
    return !!user;
}

export async function loginExistingUser(
    email: string,
    password: string
): Promise<string> {
    const user = await getUserByEmail(email);
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
        throw new HttpError(401, 'Invalid Credentials');
    }
    return generateToken({ id: user.id, role: user.role });
}

export async function checkIfCodeIsValid(code: string): Promise<{
    isCodeValid: boolean;
    requestedBy: string;
    requestedFor: string;
}> {
    const res = await db
        .select({
            requestedFor: verificationCode.requestedFor,
            requestedBy: verificationCode.requestedBy,
            createdAt: verificationCode.createdAt,
        })
        .from(verificationCode)
        .where(eq(verificationCode.code, code));

    // if the code is not found, return false
    if (res.length === 0) {
        return { isCodeValid: false, requestedBy: '', requestedFor: '' };
    }

    // Check if the code is valid for 24 hours
    const createdAt = new Date(res[0].createdAt).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - createdAt;
    if (timeDifference > 24 * 60 * 60 * 1000) {
        return { isCodeValid: false, requestedBy: '', requestedFor: '' };
    } else {
        return {
            isCodeValid: true,
            requestedBy: res[0].requestedBy,
            requestedFor: res[0].requestedFor,
        };
    }
}

export async function updateUserPassword(
    newPassword: string,
    userId: string
): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db
        .update(user)
        .set({ password: hashedPassword })
        .where(eq(user.id, userId))
        .execute();
}

export async function generateVerificationCode(
    requestedFor: string,
    requestedBy: string
): Promise<string> {
    const code = envSchema.NODE_ENV === 'test' ? '123456' : uuidv4();
    await db
        .insert(verificationCode)
        .values({
            id: uuidv7(),
            code,
            requestedFor,
            requestedBy,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })
        .execute();
    return code;
}
