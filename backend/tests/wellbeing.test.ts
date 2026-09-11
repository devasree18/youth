import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import app from '../src/server';
import { getJwtSecret } from '../src/middleware/auth';
import { WellbeingService } from '../src/services/WellbeingService';
import { WellbeingInsightService } from '../src/services/WellbeingInsightService';

describe('Wellbeing Insights & Scoring Engine Tests', () => {
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

  it('WellbeingService calculates default score for user without records', async () => {
    const summary = await WellbeingService.calculateWellbeingScore(dummyUserId);

    expect(summary).toBeDefined();
    expect(summary.wellbeingScore).toBe(70);
    expect(summary.scoreLabel).toBe('Good');
    expect(summary.recentMoodCount).toBe(0);
  });

  it('WellbeingInsightService generates structured four-area dashboard without crash', async () => {
    const dashboard = await WellbeingInsightService.getDashboardInsights(dummyUserId);

    expect(dashboard).toBeDefined();
    expect(dashboard.todayCheckIn).toBeDefined();
    expect(dashboard.focusReset).toBeDefined();
    expect(dashboard.emotionalTrend).toBeDefined();
    expect(dashboard.suggestedStep).toBeDefined();
    expect(dashboard.disclaimer).toContain('not a medical diagnosis');
  });

  it('GET /api/v1/wellbeing/insights without auth should return 401 UNAUTHORIZED', async () => {
    const res = await request(app).get('/api/v1/wellbeing/insights');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/wellbeing/insights with auth should return 200 with dashboard data', async () => {
    const res = await request(app)
      .get('/api/v1/wellbeing/insights')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.todayCheckIn).toBeDefined();
    expect(res.body.data.focusReset).toBeDefined();
    expect(res.body.data.emotionalTrend).toBeDefined();
    expect(res.body.data.suggestedStep).toBeDefined();
  });

  it('GET /api/v1/wellbeing/trends with auth should return 200 with trend data', async () => {
    const res = await request(app)
      .get('/api/v1/wellbeing/trends')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.emotionalTrend).toBeDefined();
    expect(res.body.data.focusReset).toBeDefined();
  });

  it('DELETE /api/v1/wellbeing/insights/:id with invalid ID should return 400 INVALID_ID', async () => {
    const res = await request(app)
      .delete('/api/v1/wellbeing/insights/invalid-id')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INVALID_ID');
  });
});
