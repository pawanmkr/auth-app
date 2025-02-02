import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './migrations',
    schema: [
        './src/db/schema/user.schema.ts',
        './src/db/schema/verification_code.schema.ts',
    ],
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
