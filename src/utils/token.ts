import 'dotenv/config';
import { sign, verify, JwtPayload, JsonWebTokenError } from 'jsonwebtoken';
import { envSchema } from '../config/env';

const DEFAULT_TTL_SECONDS = 60 * 60; // 1 hour
const JWT_SECRET = envSchema.JWT_SECRET;

export function generateToken(
    payload: object,
    ttl: number = DEFAULT_TTL_SECONDS
): string {
    return sign(payload, JWT_SECRET, { expiresIn: ttl });
}

export function verifyToken(token: string): JwtPayload | string | null {
    return verify(token, JWT_SECRET);
}
