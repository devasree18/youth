import mongoose, { Schema, Document } from 'mongoose';

export interface IFeatureFlag extends Document {
  key: string;
  description: string;
  isEnabled: boolean;
  targetTenants?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const featureFlagSchema = new Schema<IFeatureFlag>({
  key: { type: String, required: true, unique: true, uppercase: true, index: true },
  description: { type: String, required: true },
  isEnabled: { type: Boolean, default: false, index: true },
  targetTenants: [{ type: String }]
}, { timestamps: true });

export const FeatureFlag = mongoose.model<IFeatureFlag>('FeatureFlag', featureFlagSchema);
