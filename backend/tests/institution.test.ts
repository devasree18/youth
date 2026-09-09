import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

describe('Phase 6 Institution SaaS & Multi-Tenancy Scoping Tests', () => {
  let studentToken: string;
  let instAdminToken: string;
  const dummyInstId = new mongoose.Types.ObjectId().toString();

  beforeAll(() => {
    process.env.JWT_SECRET = 'test_jwt_secret_key_minimum_32_characters_long_for_security';
    studentToken = jwt.sign(
      { userId: new mongoose.Types.ObjectId().toString(), role: 'STUDENT', permissions: ['resources.read'] },
      process.env.JWT_SECRET
    );
    instAdminToken = jwt.sign(
      { 
        userId: new mongoose.Types.ObjectId().toString(), 
        role: 'INSTITUTION_ADMIN', 
        institutionId: dummyInstId,
        permissions: ['institution.analytics.read', 'institution.manage'] 
      },
      process.env.JWT_SECRET
    );
  });

  it('GET /api/v1/institution/stats with STUDENT token should return 403 FORBIDDEN', async () => {
    const res = await request(app)
      .get('/api/v1/institution/stats')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/institution/stats with INSTITUTION_ADMIN token should return 200 with scoped metrics', async () => {
    const res = await request(app)
      .get('/api/v1/institution/stats')
      .set('Authorization', `Bearer ${instAdminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.activeStudents).toBeDefined();
  });
});
