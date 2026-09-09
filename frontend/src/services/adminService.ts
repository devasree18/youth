import { apiClient } from '../api/apiClient';
import type { ApiResponse } from '../api/apiClient';

export interface AdminStats {
  totalUsers: number;
  totalInstitutions: number;
  activeCounselors: number;
  totalAssessments: number;
}

export interface AuditLogEntry {
  _id: string;
  action: string;
  resource: string;
  userId?: string;
  ipAddress?: string;
  createdAt: string;
}

export const adminService = {
  async getStats(): Promise<ApiResponse<AdminStats>> {
    return apiClient.get('/admin/stats');
  },

  async getAuditLogs(page: number = 1, limit: number = 50): Promise<ApiResponse<AuditLogEntry[]>> {
    return apiClient.get(`/admin/audit-logs?page=${page}&limit=${limit}`);
  },

  async getUsers(page: number = 1, limit: number = 30): Promise<ApiResponse<any[]>> {
    return apiClient.get(`/admin/users?page=${page}&limit=${limit}`);
  },

  async updateUserStatus(userId: string, accountStatus: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION'): Promise<ApiResponse<any>> {
    return apiClient.patch(`/admin/users/${userId}/status`, { accountStatus });
  }
};
