import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

describe('Phase 8 System Administration & Audit Logging Tests', () => {
  let studentToken: string;
  let adminToken: string;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test_jwt_secret_key_minimum_32_characters_long_for_security';
    studentToken = jwt.sign(
      { userId: new mongoose.Types.ObjectId().toString(), role: 'STUDENT', permissions: ['resources.read'] },
      process.env.JWT_SECRET
    );
    adminToken = jwt.sign(
      { 
        userId: new mongoose.Types.ObjectId().toString(), 
        role: 'ADMIN', 
        permissions: ['system.manage', 'users.read'] 
      },
      process.env.JWT_SECRET
    );
  });

  it('GET /api/v1/admin/stats with STUDENT token should return 403 FORBIDDEN', async () => {
    const res = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/admin/stats with ADMIN token should return 200 with system metrics', async () => {
    const res = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalUsers).toBeDefined();
  });
});
