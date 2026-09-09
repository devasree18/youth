import { apiClient } from '../api/apiClient';
import type { ApiResponse } from '../api/apiClient';

export interface Appointment {
  _id: string;
  counselorId: any;
  studentId: string;
  scheduledAt: string;
  durationMinutes: number;
  consultationType: 'online' | 'in_person';
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  createdAt: string;
}

export const appointmentService = {
  async bookAppointment(counselorId: string, scheduledAt: string, consultationType: 'online' | 'in_person' = 'online', notes?: string): Promise<ApiResponse<Appointment>> {
    return apiClient.post('/appointments/book', { counselorId, scheduledAt, consultationType, notes });
  },

  async getMyAppointments(): Promise<ApiResponse<Appointment[]>> {
    return apiClient.get('/appointments/my');
  },

  async updateStatus(appointmentId: string, status: 'CANCELLED' | 'COMPLETED', cancellationReason?: string): Promise<ApiResponse<Appointment>> {
    return apiClient.put(`/appointments/${appointmentId}/status`, { status, cancellationReason });
  }
};
