import { describe, it, expect } from 'vitest';
import { CrisisService } from '../src/services/CrisisService';
import { AIService } from '../src/services/AIService';

describe('Phase 3 Crisis & AI Safety Interceptor Tests', () => {
  it('CrisisService evaluates benign text as non-crisis', () => {
    const res = CrisisService.evaluateText('I feel stressed about my upcoming semester exams.');
    expect(res.isCrisis).toBe(false);
    expect(res.riskLevel).toBe('NONE');
    expect(res.resources.length).toBeGreaterThan(0);
  });

  it('CrisisService detects self-harm keywords as immediate crisis', () => {
    const res = CrisisService.evaluateText('I feel so hopeless and want to end my life');
    expect(res.isCrisis).toBe(true);
    expect(res.riskLevel).toBe('IMMEDIATE_DANGER');
    expect(res.resources.length).toBeGreaterThan(0);
  });

  it('AIService intercepts crisis messages before sending to AI provider', async () => {
    const res = await AIService.processChat('dummy_user_id', 'I want to kill myself');
    expect(res.isCrisisIntercepted).toBe(true);
    expect(res.reply).toContain('Safety Notice');
    expect(res.reply).toContain('14416');
  });
});
