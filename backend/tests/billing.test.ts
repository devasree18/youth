import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { getJwtSecret } from '../src/middleware/auth';

describe('Phase 7 Monetization, Billing & Entitlements Tests', () => {
  let userToken: string;
  const dummyUserId = new mongoose.Types.ObjectId().toString();

  beforeAll(() => {
    const secret = getJwtSecret();
    userToken = jwt.sign(
      { userId: dummyUserId, role: 'STUDENT', permissions: ['resources.read'] },
      secret
    );
  });

  it('GET /api/v1/subscriptions/plans should return 200 with available tiers', async () => {
    const res = await request(app).get('/api/v1/subscriptions/plans');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('POST /api/v1/subscriptions/create-order with valid auth should return initialized checkout order', async () => {
    const res = await request(app)
      .post('/api/v1/subscriptions/create-order')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ planCode: 'STANDARD', provider: 'razorpay' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.orderId).toBeDefined();
    expect(res.body.data.providerStatus).toBeDefined();
  });
});
