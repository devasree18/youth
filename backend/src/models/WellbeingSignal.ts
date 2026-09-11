import mongoose, { Schema, Document } from 'mongoose';

export type SignalSourceType =
  | 'MOOD_CHECKIN'
  | 'ASSESSMENT'
  | 'GAME_SESSION'
  | 'JOURNAL_REFLECTION'
  | 'HABIT'
  | 'USER_PREFERENCE';

export type SignalType =
  | 'SELF_REPORTED_STRESS'
  | 'SELF_REPORTED_CALM'
  | 'SELF_REPORTED_FOCUS'
  | 'EMOTIONAL_AWARENESS'
  | 'COPING_PREFERENCE'
  | 'GAME_ENGAGEMENT'
  | 'SUPPORT_INTEREST';

export interface IWellbeingSignal extends Document {
  userId: mongoose.Types.ObjectId;
  tenantId?: mongoose.Types.ObjectId;
  sourceType: SignalSourceType;
  sourceId?: string;
  signalType: SignalType;
  value: string | number | boolean;
  confidence: number; // 0.0 to 1.0 (low for passive, higher for user-confirmed)
  userReported: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  expiresAt: Date;
}

const wellbeingSignalSchema = new Schema<IWellbeingSignal>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
    sourceType: {
      type: String,
      enum: [
        'MOOD_CHECKIN',
        'ASSESSMENT',
        'GAME_SESSION',
        'JOURNAL_REFLECTION',
        'HABIT',
        'USER_PREFERENCE',
      ],
      required: true,
      index: true,
    },
    sourceId: { type: String, index: true },
    signalType: {
      type: String,
      enum: [
        'SELF_REPORTED_STRESS',
        'SELF_REPORTED_CALM',
        'SELF_REPORTED_FOCUS',
        'EMOTIONAL_AWARENESS',
        'COPING_PREFERENCE',
        'GAME_ENGAGEMENT',
        'SUPPORT_INTEREST',
      ],
      required: true,
      index: true,
    },
    value: { type: Schema.Types.Mixed, required: true },
    confidence: { type: Number, required: true, min: 0, max: 1, default: 0.5 },
    userReported: { type: Boolean, default: true },
    metadata: { type: Schema.Types.Mixed },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days retention
      index: { expires: 0 },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

wellbeingSignalSchema.index({ userId: 1, createdAt: -1 });
wellbeingSignalSchema.index({ userId: 1, signalType: 1, createdAt: -1 });

export const WellbeingSignal = mongoose.model<IWellbeingSignal>(
  'WellbeingSignal',
  wellbeingSignalSchema
);
