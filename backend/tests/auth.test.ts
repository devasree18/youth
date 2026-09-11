import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/server';

describe('Auth, Security & Android Capacitor API Foundation', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test_jwt_secret_key_minimum_32_characters_long_for_security';
  });

  it('GET /api/v1/health should return 200 with standard envelope', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('OK');
  });

  it('OPTIONS /api/v1/auth/login should allow Capacitor Android origin https://localhost', async () => {
    const res = await request(app)
      .options('/api/v1/auth/login')
      .set('Origin', 'https://localhost')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Content-Type, Authorization');

    expect(res.status).toBe(204);
    expect(res.headers['access-control-allow-origin']).toBe('https://localhost');
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });

  it('OPTIONS /api/v1/auth/login should allow Capacitor scheme capacitor://localhost', async () => {
    const res = await request(app)
      .options('/api/v1/auth/login')
      .set('Origin', 'capacitor://localhost')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Content-Type, Authorization');

    expect(res.status).toBe(204);
    expect(res.headers['access-control-allow-origin']).toBe('capacitor://localhost');
  });

  it('POST /api/v1/auth/register with missing fields should return 400 validation error', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'test@example.com' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/v1/auth/login with missing fields should return 400 validation error', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .set('Origin', 'https://localhost')
      .send({ email: 'invalid-email' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/v1/auth/logout should clear cookie and return success', async () => {
    const res = await request(app)
      .post('/api/v1/auth/logout')
      .set('Origin', 'https://localhost');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/v1/auth/me without token should return 401 UNAUTHORIZED', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
