import { z } from 'zod';

// Define the environment schema
export const envs = z.object({
    // Server configuration
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),
    PORT: z.string().default('8080').transform(Number),
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
    APP_URL: z.string().min(1, 'APP_URL is required'),

    // Database
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

    // Log level configuration
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),

    // Email configuration
    EMAIL_HOST: z.string().min(1, 'EMAIL_HOST is required'),
    EMAIL_PORT: z.string().min(1, 'EMAIL_PORT is required').transform(Number),
    EMAIL_USER: z.string().min(1, 'EMAIL_USER is required'),
    EMAIL_PASS: z.string().min(1, 'EMAIL_PASS is required'),
});

// Type inference for strong typing
export type Env = z.infer<typeof envs>;

// Parse and validate environment variables
const result = envs.safeParse(process.env);

if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    process.exit(1); // Exit process if validation fails
}

export const envSchema = result.data;
