import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { getJwtSecret } from '../src/middleware/auth';

describe('Phase 5 Counselor Marketplace & Appointment Tests', () => {
  let userToken: string;
  const dummyUserId = new mongoose.Types.ObjectId().toString();

  beforeAll(() => {
    const secret = getJwtSecret();
    userToken = jwt.sign(
      { userId: dummyUserId, role: 'STUDENT', permissions: ['resources.read'] },
      secret
    );
  });

  it('GET /api/v1/counselors should return 200 with list of verified counselors', async () => {
    const res = await request(app).get('/api/v1/counselors');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('POST /api/v1/appointments/book without token should return 401 UNAUTHORIZED', async () => {
    const res = await request(app)
      .post('/api/v1/appointments/book')
      .send({
        counselorId: new mongoose.Types.ObjectId().toString(),
        scheduledAt: new Date(Date.now() + 86400000).toISOString()
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
