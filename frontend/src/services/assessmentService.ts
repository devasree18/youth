import { apiClient } from '../api/apiClient';
import type { ApiResponse } from '../api/apiClient';

export interface QuestionOption {
  label: string;
  value: number;
}

export interface Question {
  id: string;
  text: string;
  category?: string;
  options: QuestionOption[];
}

export interface AssessmentTemplate {
  code: string;
  title: string;
  description: string;
  version: number;
  questions: Question[];
}

export interface AssessmentResult {
  _id: string;
  templateCode: string;
  totalScore: number;
  maxPossibleScore: number;
  normalizedScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRISIS';
  interpretationLabel: string;
  summary: string;
  recommendations: string[];
  createdAt: string;
}

export const assessmentService = {
  async getTemplates(): Promise<ApiResponse<AssessmentTemplate[]>> {
    return apiClient.get('/assessment/templates');
  },

  async submitAssessment(templateCode: string, answers: { questionId: string; selectedValue: number }[]): Promise<ApiResponse<AssessmentResult>> {
    return apiClient.post('/assessment/submit', { templateCode, answers });
  },

  async getHistory(): Promise<ApiResponse<AssessmentResult[]>> {
    return apiClient.get('/assessment/history');
  }
};
