import express from 'express';
import { z } from 'zod';
import { Subscription } from '../models/Subscription';
import { Payment } from '../models/Payment';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { PaymentService } from '../services/PaymentService';
import { EntitlementService } from '../services/EntitlementService';
import { sendSuccess, sendError } from '../utils/response';
import mongoose from 'mongoose';

const router = express.Router();

export const DEFAULT_PLANS = [
  {
    code: 'FREE',
    name: 'Free Student Tier',
    price: 0,
    currency: 'INR',
    features: ['Daily Mood Tracking', '5 AI Assistant Messages / Day', 'Community Access', 'Crisis Support'],
    limits: { aiMessagesPerDay: 5, assessmentsPerMonth: 2, counselorSessionsIncluded: 0, institutionDashboardAccess: false }
  },
  {
    code: 'STANDARD',
    name: 'Student Premium',
    price: 299,
    currency: 'INR',
    features: ['Unlimited AI Chat', 'Deep Check-in Assessments', 'Priority Counselor Booking', 'Habit & Journaling'],
    limits: { aiMessagesPerDay: 100, assessmentsPerMonth: 20, counselorSessionsIncluded: 1, institutionDashboardAccess: false }
  },
  {
    code: 'INSTITUTION',
    name: 'Institution SaaS Tier',
    price: 49999,
    currency: 'INR',
    features: ['Campus Admin Dashboard', 'Aggregated Wellbeing Analytics', 'Custom Campaigns', 'Dedicated Support'],
    limits: { aiMessagesPerDay: 1000, assessmentsPerMonth: 1000, counselorSessionsIncluded: 10, institutionDashboardAccess: true }
  }
];

const createOrderSchema = z.object({
  planCode: z.enum(['FREE', 'STANDARD', 'PREMIUM', 'INSTITUTION', 'ENTERPRISE']),
  provider: z.enum(['razorpay', 'stripe']).default('razorpay')
});

router.get('/plans', (_req, res) => {
  return sendSuccess(res, DEFAULT_PLANS, 'Available subscription plans retrieved');
});

router.get('/current', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return sendSuccess(res, {
        planCode: 'FREE',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        features: DEFAULT_PLANS[0].features
      }, 'Current subscription retrieved (offline mode)');
    }

    const sub = await Subscription.findOne({
      userId: req.user!.userId,
      status: 'active'
    });

    const entitlements = await EntitlementService.getUserEntitlements(req.user!.userId);

    return sendSuccess(res, {
      planCode: sub?.planCode || 'FREE',
      status: sub?.status || 'active',
      currentPeriodEnd: sub?.currentPeriodEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      features: entitlements.features
    }, 'Current subscription retrieved');
  } catch (error) {
    next(error);
  }
});

router.post('/create-order', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const parseResult = createOrderSchema.safeParse(req.body);
    if (!parseResult.success) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Invalid plan details', parseResult.error.flatten().fieldErrors);
    }

    const { planCode, provider } = parseResult.data;
    const plan = DEFAULT_PLANS.find(p => p.code === planCode) || DEFAULT_PLANS[1];

    const orderResult = PaymentService.createOrder(plan.price, plan.currency, provider);

    if (mongoose.connection.readyState === 1) {
      const paymentRecord = new Payment({
        userId: req.user!.userId,
        tenantId: req.user!.tenantId,
        amount: plan.price,
        currency: plan.currency,
        provider,
        providerOrderId: orderResult.orderId,
        status: 'PENDING'
      });
      await paymentRecord.save();
    }

    return sendSuccess(res, {
      orderId: orderResult.orderId,
      amount: plan.price,
      currency: plan.currency,
      provider,
      providerStatus: orderResult.providerStatus,
      instructions: orderResult.providerStatus === 'BLOCKED' 
        ? 'Payment gateway API secret unconfigured. Order created in sandbox/blocked state.' 
        : 'Proceed to payment checkout'
    }, 'Checkout order initialized', 201);
  } catch (error) {
    next(error);
  }
});

router.post('/webhook', async (req, res, next) => {
  try {
    const { orderId, paymentId, signature, userId, planCode } = req.body;

    if (!orderId || !paymentId) {
      return sendError(res, 400, 'INVALID_WEBHOOK_PAYLOAD', 'Missing payment webhook identifiers');
    }

    const isValid = PaymentService.verifyRazorpaySignature(orderId, paymentId, signature || '');
    if (!isValid && process.env.NODE_ENV === 'production') {
      return sendError(res, 400, 'INVALID_SIGNATURE', 'Webhook signature verification failed');
    }

    if (mongoose.connection.readyState === 1 && userId && planCode) {
      await Subscription.findOneAndUpdate(
        { userId },
        { 
          planCode,
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        { upsert: true, new: true }
      );
    }

    return sendSuccess(res, { verified: true }, 'Webhook processed & subscription activated');
  } catch (error) {
    next(error);
  }
});

export default router;
