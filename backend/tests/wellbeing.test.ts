import { describe, it, expect } from 'vitest';
import { WellbeingService } from '../src/services/WellbeingService';
import mongoose from 'mongoose';

describe('Phase 2 Wellbeing & Scoring Engine Tests', () => {
  it('WellbeingService calculates default score for user without records', async () => {
    const dummyUserId = new mongoose.Types.ObjectId().toString();
    const summary = await WellbeingService.calculateWellbeingScore(dummyUserId);

    expect(summary).toBeDefined();
    expect(summary.wellbeingScore).toBe(70);
    expect(summary.scoreLabel).toBe('Good');
    expect(summary.recentMoodCount).toBe(0);
  });
});
