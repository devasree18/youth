import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import app from '../src/server';
import { getJwtSecret } from '../src/middleware/auth';

describe('Wellbeing Mini-Games API Tests', () => {
  let studentToken: string;
  const dummyUserId = new mongoose.Types.ObjectId().toString();

  beforeAll(() => {
    const secret = getJwtSecret();
    studentToken = jwt.sign(
      {
        userId: dummyUserId,
        email: 'student@example.edu',
        role: 'student',
      },
      secret,
      { expiresIn: '1h' }
    );
  });

  it('POST /api/v1/games/sessions without auth should return 401 UNAUTHORIZED', async () => {
    const res = await request(app)
      .post('/api/v1/games/sessions')
      .send({ gameType: 'BREATHING_FLOW' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('POST /api/v1/games/sessions with invalid gameType should return 400 VALIDATION_ERROR', async () => {
    const res = await request(app)
      .post('/api/v1/games/sessions')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ gameType: 'INVALID_GAME_TYPE' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('PATCH /api/v1/games/sessions/:id with invalid ID format should return 400 INVALID_ID', async () => {
    const res = await request(app)
      .patch('/api/v1/games/sessions/nonexistent-id')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ status: 'COMPLETED' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INVALID_ID');
  });

  it('GET /api/v1/games/patterns with auth should return 200 with non-diagnostic patterns and recommendations', async () => {
    const res = await request(app)
      .get('/api/v1/games/patterns')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.patterns)).toBe(true);
    expect(Array.isArray(res.body.data.recommendations)).toBe(true);
  });

  it('DELETE /api/v1/games/sessions/:id with invalid ID format should return 400 INVALID_ID', async () => {
    const res = await request(app)
      .delete('/api/v1/games/sessions/invalid-id')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INVALID_ID');
  });
});
