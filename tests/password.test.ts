// tests/integration.test.ts
import request from 'supertest';
import { app } from '../src/app';
import { testDbConnection } from '../src/db/drizzle';

const testAdmin = {
    name: 'Test admin',
    email: `testadmin-${Date.now()}@example.com`,
    password: 'password123',
    role: 'admin',
};
let token: string;

describe('Full Integration Tests (No Mocks)', () => {
    beforeAll(async () => {
        await testDbConnection();
    }, 50000); // Increase timeout to 50 seconds

    describe('POST /api/v1/auth/password/reset/request', () => {
        it('should register a new admin successfully', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    ...testAdmin,
                });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('email', testAdmin.email);
        });

        it('should login an existing admin successfully, to grab jwt to access protected routes', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: testAdmin.email,
                    password: testAdmin.password,
                });
            expect(response.status).toBe(200);
            token = response.body.token;
        });

        it('should generate a unique verification code for password reset and also send mail on registered email id', async () => {
            const response = await request(app)
                .post('/api/v1/auth/password/reset/request')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    email: testAdmin.email,
                });
            expect(response.status).toBe(201);
        });

        it('should update the password of the user with the verification code', async () => {
            const response = await request(app)
                .put(`/api/v1/auth/password/reset?code=123456`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    newPassword: 'newpassword',
                    confirmPassword: 'newpassword',
                });
            expect(response.status).toBe(200);
        });
    });
});
