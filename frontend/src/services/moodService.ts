import { apiClient } from '../api/apiClient';
import type { ApiResponse } from '../api/apiClient';

export interface MoodEntry {
  _id: string;
  mood: 'very_low' | 'low' | 'okay' | 'good' | 'great';
  score: number;
  note?: string;
  factors?: string[];
  createdAt: string;
}

export const moodService = {
  async recordMood(mood: string, note?: string, factors?: string[]): Promise<ApiResponse<MoodEntry>> {
    return apiClient.post('/mood', { mood, note, factors });
  },

  async getHistory(limit: number = 30): Promise<ApiResponse<MoodEntry[]>> {
    return apiClient.get(`/mood/history?limit=${limit}`);
  }
};
