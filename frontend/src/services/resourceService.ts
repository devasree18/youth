import { apiClient } from '../api/apiClient';
import type { ApiResponse } from '../api/apiClient';

export interface ResourceItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  author: string;
  readTimeMinutes: number;
  tags?: string[];
  createdAt?: string;
}

export const resourceService = {
  async getResources(category?: string, search?: string): Promise<ApiResponse<ResourceItem[]>> {
    let url = '/resources';
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (params.toString()) url += `?${params.toString()}`;
    return apiClient.get(url);
  },

  async getResourceById(id: string): Promise<ApiResponse<ResourceItem>> {
    return apiClient.get(`/resources/${id}`);
  }
};
