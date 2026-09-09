import { apiClient } from '../api/apiClient';
import type { ApiResponse } from '../api/apiClient';

export interface AIChatResponse {
  reply: string;
  isCrisisIntercepted: boolean;
  providerStatus: 'LIVE' | 'BLOCKED';
  conversationId?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'ai';
  content: string;
  isCrisisIntercepted?: boolean;
  createdAt?: string;
}

export const aiService = {
  async sendMessage(message: string): Promise<ApiResponse<AIChatResponse>> {
    return apiClient.post('/ai/chat', { message });
  },

  async getHistory(): Promise<ApiResponse<ChatMessage[]>> {
    return apiClient.get('/ai/history');
  }
};
