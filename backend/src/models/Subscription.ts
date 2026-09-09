import mongoose, { Schema, Document } from 'mongoose';

export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  tenantId?: mongoose.Types.ObjectId;
  planCode: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  paymentProvider?: 'razorpay' | 'stripe';
  providerSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
  planCode: { type: String, required: true, uppercase: true, default: 'FREE', index: true },
  status: { 
    type: String, 
    enum: ['active', 'past_due', 'canceled', 'trialing'], 
    default: 'active',
    index: true 
  },
  currentPeriodStart: { type: Date, default: Date.now },
  currentPeriodEnd: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  paymentProvider: { type: String, enum: ['razorpay', 'stripe'] },
  providerSubscriptionId: { type: String }
}, { timestamps: true });

export const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);
