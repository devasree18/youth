import mongoose from 'mongoose';
import { Subscription } from '../models/Subscription';
import { Plan } from '../models/Plan';

export interface EntitlementCheckResult {
  allowed: boolean;
  reason?: string;
  planCode: string;
}

export class EntitlementService {
  public static async getUserEntitlements(userId: string): Promise<{ planCode: string; features: string[] }> {
    if (mongoose.connection.readyState !== 1) {
      return { planCode: 'FREE', features: ['resources.read', 'assessments.read'] };
    }

    const sub = await Subscription.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      status: 'active'
    });

    const planCode = sub?.planCode || 'FREE';
    const plan = await Plan.findOne({ code: planCode as any });

    return {
      planCode,
      features: plan?.features || ['resources.read', 'assessments.read']
    };
  }

  public static async checkEntitlement(
    userId: string,
    featureKey: 'institution_dashboard' | 'advanced_analytics' | 'counselor_access'
  ): Promise<EntitlementCheckResult> {
    const entitlements = await this.getUserEntitlements(userId);
    const planCode = entitlements.planCode;

    if (planCode === 'ENTERPRISE' || planCode === 'INSTITUTION' || planCode === 'PREMIUM') {
      return { allowed: true, planCode };
    }

    if (featureKey === 'institution_dashboard' && planCode !== 'INSTITUTION' && planCode !== 'ENTERPRISE') {
      return {
        allowed: false,
        reason: 'Institution SaaS Dashboard requires an INSTITUTION or ENTERPRISE plan.',
        planCode
      };
    }

    return { allowed: true, planCode };
  }
}
