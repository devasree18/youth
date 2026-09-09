import { apiClient } from '../api/apiClient';
import type { ApiResponse } from '../api/apiClient';

export interface CommunityPost {
  _id: string;
  pseudonym: string;
  category: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export interface PostComment {
  _id: string;
  postId: string;
  pseudonym: string;
  content: string;
  createdAt: string;
}

export const communityService = {
  async getPosts(page: number = 1, category?: string): Promise<ApiResponse<CommunityPost[]>> {
    const url = `/community/posts?page=${page}${category ? `&category=${encodeURIComponent(category)}` : ''}`;
    return apiClient.get(url);
  },

  async createPost(content: string, category?: string, pseudonym?: string): Promise<ApiResponse<CommunityPost>> {
    return apiClient.post('/community/posts', { content, category, pseudonym });
  },

  async likePost(postId: string): Promise<ApiResponse<{ likesCount: number }>> {
    return apiClient.post(`/community/posts/${postId}/like`);
  },

  async getComments(postId: string): Promise<ApiResponse<PostComment[]>> {
    return apiClient.get(`/community/posts/${postId}/comments`);
  },

  async addComment(postId: string, content: string, pseudonym?: string): Promise<ApiResponse<PostComment>> {
    return apiClient.post(`/community/posts/${postId}/comments`, { content, pseudonym });
  },

  async reportContent(targetType: 'POST' | 'COMMENT', targetId: string, reason: string, details?: string): Promise<ApiResponse<null>> {
    return apiClient.post('/community/report', { targetType, targetId, reason, details });
  }
};
