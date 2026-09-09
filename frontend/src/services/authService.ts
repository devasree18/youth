import { apiClient } from '../api/apiClient';
import type { ApiResponse } from '../api/apiClient';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: string;
  permissions?: string[];
  tenantId?: string;
  institutionId?: string;
  accountStatus?: string;
  createdAt?: string;
}

export const authService = {
  async register(name: string, email: string, pass: string, role?: string): Promise<ApiResponse<{ token: string; user: UserProfile }>> {
    return apiClient.post('/auth/register', { name, email, password: pass, role });
  },

  async login(email: string, pass: string): Promise<ApiResponse<{ token: string; user: UserProfile }>> {
    return apiClient.post('/auth/login', { email, password: pass });
  },

  async logout(): Promise<ApiResponse<null>> {
    return apiClient.post('/auth/logout');
  },

  async getCurrentUser(): Promise<ApiResponse<UserProfile>> {
    return apiClient.get('/auth/me');
  }
};
