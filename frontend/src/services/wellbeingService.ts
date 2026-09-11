import { apiClient } from '../api/apiClient';
import type { ApiResponse } from '../api/apiClient';

export interface TodayCheckInInsight {
  checkedInToday: boolean;
  latestMoodScore?: number;
  latestMoodNote?: string;
  title: string;
  description: string;
  recommendedAction: {
    label: string;
    route: string;
  };
}

export interface FocusResetInsight {
  weeklyResetCount: number;
  totalMinutes: number;
  favoriteGame: string;
  favoriteGameLabel: string;
  consistencyTrend: 'steady' | 'improving' | 'variable' | 'baseline';
  title: string;
  description: string;
  recentSessions: Array<{
    gameType: string;
    durationSeconds: number;
    createdAt: string;
    accuracy?: number;
  }>;
}

export interface EmotionalTrendInsight {
  trendDirection: 'STEADY' | 'ELEVATED_STRESS' | 'IMPROVING' | 'INSUFFICIENT_DATA';
  title: string;
  description: string;
  confidenceLabel: string;
  dataPointsCount: number;
}

export interface SuggestedNextStep {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  actionRoute: string;
  category: 'GAME' | 'JOURNAL' | 'ASSESSMENT' | 'RESOURCE' | 'SUPPORT' | 'CRISIS';
  isCrisisSupport: boolean;
}

export interface WellbeingDashboardInsights {
  todayCheckIn: TodayCheckInInsight;
  focusReset: FocusResetInsight;
  emotionalTrend: EmotionalTrendInsight;
  suggestedStep: SuggestedNextStep;
  allInsights: Array<{
    _id: string;
    insightType: string;
    title: string;
    description: string;
    dataPeriod: string;
    recommendedAction?: {
      label: string;
      route: string;
    };
    confidenceLevel: string;
    privacyClassification: string;
    createdAt: string;
  }>;
  generatedAt: string;
  disclaimer: string;
}

export interface WellbeingSummary {
  wellbeingScore: number;
  scoreLabel: 'Low' | 'Moderate' | 'Good' | 'Optimal';
  trend: 'Improving' | 'Stable' | 'Needs Attention';
  recentMoodCount: number;
  latestAssessmentDate?: string;
  recommendations: string[];
}

export interface WellbeingTrendsResponse {
  emotionalTrend: EmotionalTrendInsight;
  focusReset: FocusResetInsight;
  todayCheckIn: TodayCheckInInsight;
  generatedAt: string;
}

export const wellbeingService = {
  async getInsights(): Promise<ApiResponse<WellbeingDashboardInsights>> {
    return apiClient.get('/wellbeing/insights');
  },

  async getSummary(): Promise<ApiResponse<WellbeingSummary>> {
    return apiClient.get('/wellbeing/summary');
  },

  async getTrends(): Promise<ApiResponse<WellbeingTrendsResponse>> {
    return apiClient.get('/wellbeing/trends');
  },

  async deleteInsight(insightId: string): Promise<ApiResponse<{ deletedId: string }>> {
    return apiClient.delete(`/wellbeing/insights/${insightId}`);
  },
};
