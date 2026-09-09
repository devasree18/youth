import { apiClient } from '../api/apiClient';
import type { ApiResponse } from '../api/apiClient';

export interface WellbeingSummary {
  wellbeingScore: number;
  scoreLabel: 'Low' | 'Moderate' | 'Good' | 'Optimal';
  trend: 'Improving' | 'Stable' | 'Needs Attention';
  recentMoodCount: number;
  latestAssessmentDate?: string;
  recommendations: string[];
}

export const wellbeingService = {
  async getSummary(): Promise<ApiResponse<WellbeingSummary>> {
    return apiClient.get('/wellbeing/summary');
  }
};
