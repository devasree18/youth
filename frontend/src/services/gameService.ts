import { apiClient } from '../api/apiClient';
import type { ApiResponse } from '../api/apiClient';

export type GameType = 'BREATHING_FLOW' | 'FOCUS_TAP' | 'MOOD_MATCH';
export type GameStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

export interface GameReflection {
  question?: string;
  response?: string;
  savedAt?: string;
}

export interface GameSession {
  _id: string;
  userId: string;
  gameType: GameType;
  startedAt: string;
  completedAt?: string;
  durationSeconds: number;
  status: GameStatus;
  resultSummary?: string;
  accuracy?: number;
  preCheckin?: string;
  postCheckin?: string;
  reflection?: GameReflection;
  insight?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface GameSummary {
  totalSessions: number;
  totalDurationSeconds: number;
  totalMinutes: number;
  favoriteGame: GameType;
  weeklyResetCount: number;
  recentSessions: GameSession[];
}

export interface UserPatternInsight {
  title: string;
  description: string;
  category: 'CALM' | 'FOCUS' | 'AWARENESS' | 'ROUTINE';
  confidenceLabel: 'Observed trend' | 'Self-reported pattern';
}

export interface WellbeingRecommendation {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  actionRoute: string;
  reason: string;
}

export interface PatternDataResponse {
  patterns: UserPatternInsight[];
  recommendations: WellbeingRecommendation[];
}

export interface EmergencyResource {
  name: string;
  contact: string;
  description: string;
  hours: string;
  region: string;
  category: string;
}

export interface CrisisAlert {
  isCrisis: boolean;
  riskLevel: string;
  message: string;
  resources: EmergencyResource[];
}

export interface UpdateSessionResponse {
  session: GameSession;
  crisisAlert: CrisisAlert | null;
}

export const gameService = {
  async startSession(
    gameType: GameType,
    preCheckin?: string,
    metadata?: Record<string, any>
  ): Promise<ApiResponse<GameSession>> {
    return apiClient.post('/games/sessions', { gameType, preCheckin, metadata });
  },

  async completeSession(
    sessionId: string,
    data: {
      status: GameStatus;
      durationSeconds?: number;
      resultSummary?: string;
      accuracy?: number;
      postCheckin?: string;
      reflection?: {
        question?: string;
        response?: string;
      };
      metadata?: Record<string, any>;
    }
  ): Promise<ApiResponse<UpdateSessionResponse>> {
    return apiClient.patch(`/games/sessions/${sessionId}`, data);
  },

  async getSessions(
    limit: number = 20,
    gameType?: GameType
  ): Promise<ApiResponse<GameSession[]>> {
    const params = new URLSearchParams();
    params.set('limit', limit.toString());
    if (gameType) params.set('gameType', gameType);
    return apiClient.get(`/games/sessions?${params.toString()}`);
  },

  async getSummary(): Promise<ApiResponse<GameSummary>> {
    return apiClient.get('/games/summary');
  },

  async getPatterns(): Promise<ApiResponse<PatternDataResponse>> {
    return apiClient.get('/games/patterns');
  },

  async deleteSession(sessionId: string): Promise<ApiResponse<{ deletedId: string }>> {
    return apiClient.delete(`/games/sessions/${sessionId}`);
  },
};
