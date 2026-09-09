import { apiClient } from '../api/apiClient';
import type { ApiResponse } from '../api/apiClient';

export interface PlanTier {
  code: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  limits: {
    aiMessagesPerDay: number;
    assessmentsPerMonth: number;
    counselorSessionsIncluded: number;
    institutionDashboardAccess: boolean;
  };
}

export interface UserSubscription {
  planCode: string;
  status: string;
  currentPeriodEnd: string;
  features: string[];
}

export interface OrderCheckoutResult {
  orderId: string;
  amount: number;
  currency: string;
  provider: string;
  providerStatus: 'LIVE' | 'BLOCKED';
  instructions?: string;
}

export const subscriptionService = {
  async getPlans(): Promise<ApiResponse<PlanTier[]>> {
    return apiClient.get('/subscriptions/plans');
  },

  async getCurrentSubscription(): Promise<ApiResponse<UserSubscription>> {
    return apiClient.get('/subscriptions/current');
  },

  async createCheckoutOrder(planCode: string, provider: 'razorpay' | 'stripe' = 'razorpay'): Promise<ApiResponse<OrderCheckoutResult>> {
    return apiClient.post('/subscriptions/create-order', { planCode, provider });
  }
};
