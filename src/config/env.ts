import { z } from 'zod';

// Define the environment schema
export const envs = z.object({
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),
    PORT: z.string().default('8080').transform(Number),
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
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
