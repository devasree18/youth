import { apiClient } from '../api/apiClient';
import type { ApiResponse } from '../api/apiClient';

export interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Counselor {
  _id: string;
  name: string;
  specialization: string;
  qualifications: string[];
  languages: string[];
  consultationType: 'online' | 'in_person' | 'both';
  price: number;
  currency: string;
  rating: number;
  reviewsCount: number;
  description: string;
  availabilitySlots: AvailabilitySlot[];
}

export const counselorService = {
  async getCounselors(specialization?: string, type?: string): Promise<ApiResponse<Counselor[]>> {
    let url = '/counselors';
    const params = new URLSearchParams();
    if (specialization) params.append('specialization', specialization);
    if (type) params.append('type', type);
    if (params.toString()) url += `?${params.toString()}`;
    return apiClient.get(url);
  },

  async getCounselorById(id: string): Promise<ApiResponse<Counselor>> {
    return apiClient.get(`/counselors/${id}`);
  }
};
