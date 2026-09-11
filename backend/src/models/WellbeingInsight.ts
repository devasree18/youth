import mongoose, { Schema, Document } from 'mongoose';

export type InsightType =
  | 'CHECK_IN'
  | 'FOCUS_RESET'
  | 'EMOTIONAL_TREND'
  | 'SUGGESTED_ACTION'
  | 'HABIT_ROUTINE';

export type PrivacyClassification = 'CONFIDENTIAL_STUDENT_ONLY' | 'ANONYMIZED_AGGREGATE';

export interface RecommendedAction {
  label: string;
  route: string;
  category: 'GAME' | 'JOURNAL' | 'ASSESSMENT' | 'RESOURCE' | 'SUPPORT' | 'CRISIS';
}

export interface IWellbeingInsight extends Document {
  userId: mongoose.Types.ObjectId;
  tenantId?: mongoose.Types.ObjectId;
  insightType: InsightType;
  title: string;
  description: string;
  dataPeriod: string;
  recommendedAction?: RecommendedAction;
  confidenceLevel: 'OBSERVED_PATTERN' | 'SELF_REPORTED' | 'BASELINE';
  privacyClassification: PrivacyClassification;
  isCrisisAlert?: boolean;
  metadata?: Record<string, any>;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const wellbeingInsightSchema = new Schema<IWellbeingInsight>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
    insightType: {
      type: String,
      enum: ['CHECK_IN', 'FOCUS_RESET', 'EMOTIONAL_TREND', 'SUGGESTED_ACTION', 'HABIT_ROUTINE'],
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 300 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    dataPeriod: { type: String, default: 'Past 7 days', maxlength: 100 },
    recommendedAction: {
      label: { type: String, maxlength: 100 },
      route: { type: String, maxlength: 200 },
      category: {
        type: String,
        enum: ['GAME', 'JOURNAL', 'ASSESSMENT', 'RESOURCE', 'SUPPORT', 'CRISIS'],
      },
    },
    confidenceLevel: {
      type: String,
      enum: ['OBSERVED_PATTERN', 'SELF_REPORTED', 'BASELINE'],
      default: 'OBSERVED_PATTERN',
    },
    privacyClassification: {
      type: String,
      enum: ['CONFIDENTIAL_STUDENT_ONLY', 'ANONYMIZED_AGGREGATE'],
      default: 'CONFIDENTIAL_STUDENT_ONLY',
    },
    isCrisisAlert: { type: Boolean, default: false },
    metadata: { type: Schema.Types.Mixed },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

wellbeingInsightSchema.index({ userId: 1, createdAt: -1 });
wellbeingInsightSchema.index({ userId: 1, insightType: 1 });

export const WellbeingInsight = mongoose.model<IWellbeingInsight>(
  'WellbeingInsight',
  wellbeingInsightSchema
);
