import { apiClient } from '../api/apiClient';
import type { ApiResponse } from '../api/apiClient';

export interface InstitutionStats {
  activeStudents: number;
  checkInParticipation: number;
  aggregatedWellbeingIndex: number | null;
  riskLevelBreakdown?: { low: number; moderate: number; high: number };
  anonymized: boolean;
  privacyNotice?: string;
}

export interface InstitutionMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  accountStatus: string;
  createdAt: string;
}

export const institutionService = {
  async getStats(): Promise<ApiResponse<InstitutionStats>> {
    return apiClient.get('/institution/stats');
  },

  async getMembers(): Promise<ApiResponse<InstitutionMember[]>> {
    return apiClient.get('/institution/members');
  },

  async inviteMember(name: string, email: string, role: string): Promise<ApiResponse<Partial<InstitutionMember>>> {
    return apiClient.post('/institution/members/invite', { name, email, role });
  }
};
