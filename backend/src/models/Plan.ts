import mongoose, { Schema, Document } from 'mongoose';

export interface IPlan extends Document {
  code: 'FREE' | 'STANDARD' | 'PREMIUM' | 'INSTITUTION' | 'ENTERPRISE';
  name: string;
  price: number;
  currency: string;
  billingInterval: 'MONTHLY' | 'ANNUAL';
  features: string[];
  limits: {
    aiMessagesPerDay: number;
    assessmentsPerMonth: number;
    counselorSessionsIncluded: number;
    institutionDashboardAccess: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new Schema<IPlan>({
  code: { type: String, enum: ['FREE', 'STANDARD', 'PREMIUM', 'INSTITUTION', 'ENTERPRISE'], required: true, unique: true, index: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  currency: { type: String, default: 'INR' },
  billingInterval: { type: String, enum: ['MONTHLY', 'ANNUAL'], default: 'MONTHLY' },
  features: [{ type: String }],
  limits: {
    aiMessagesPerDay: { type: Number, default: 10 },
    assessmentsPerMonth: { type: Number, default: 5 },
    counselorSessionsIncluded: { type: Number, default: 0 },
    institutionDashboardAccess: { type: Boolean, default: false }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Plan = mongoose.model<IPlan>('Plan', planSchema);
