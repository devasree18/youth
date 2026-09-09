import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { getJwtSecret } from '../src/middleware/auth';

describe('Phase 4 Community & Moderation Tests', () => {
  let userToken: string;
  const dummyUserId = new mongoose.Types.ObjectId().toString();

  beforeAll(() => {
    const secret = getJwtSecret();
    userToken = jwt.sign(
      { userId: dummyUserId, role: 'STUDENT', permissions: ['resources.read'] },
      secret
    );
  });

  it('GET /api/v1/community/posts should return 200 with standard envelope', async () => {
    const res = await request(app).get('/api/v1/community/posts');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/v1/community/posts without token should return 401', async () => {
    const res = await request(app)
      .post('/api/v1/community/posts')
      .send({ content: 'Test post without auth token' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
