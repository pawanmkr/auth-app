// tests/integration.test.ts
import request from 'supertest';
import { app } from '../src/app';
import { testDbConnection } from '../src/db/drizzle';

const testUser = {
    name: 'Test User',
    email: `testuser-${Date.now()}@example.com`,
    password: 'password123',
};
let token: string;

describe('Full Integration Tests (No Mocks)', () => {
    beforeAll(async () => {
        await testDbConnection();
    }, 50000);

    describe('POST /api/v1/auth/register', () => {
        it('should register a new user successfully', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    ...testUser,
                    role: 'user',
                });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('email', testUser.email);
        });

        it('should return 409 if the user already exists', async () => {
            // Attempt to register again
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    ...testUser,
                    role: 'user',
                });
            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty(
                'message',
                'User Already Exists'
            );
        });
    });

    describe('POST /api/v1/auth/login', () => {
        it('should login an existing user successfully', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password,
                });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });

        it('should return 404 if the user does not exist', async () => {
            // Attempt to login with non-existent user
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'invalid@email.com', // Invalid email
                    password: testUser.password,
                });
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty(
                'message',
                'User Not Found, Please Register the User'
            );
        });
    });

    describe('GET /api/v1/auth/user/profile', () => {
        it('should return user profile successfully', async () => {
            const loginResponse = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password,
                });
            token = loginResponse.body.token;

            const response = await request(app)
                .get('/api/v1/auth/user/profile')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('email', testUser.email);
        });
    });

    describe('POST /api/v1/auth/password/reset/request', () => {
        it('should be failed as only admins can reset password', async () => {
            const response = await request(app)
                .post('/api/v1/auth/password/reset/request')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    email: testUser.email,
                });
            expect(response.status).toBe(403);
        });
    });
});
