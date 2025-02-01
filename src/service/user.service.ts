import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';

import { db } from '../db/drizzle';
import { User } from '../types/user';
import { user } from '../db/schema/user.schema';
import { generateToken } from '../utils/token';
import { HttpError } from '../errors/http.error';

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
