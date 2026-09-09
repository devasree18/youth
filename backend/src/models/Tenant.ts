import mongoose, { Schema, Document } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  slug: string;
  type: 'INSTITUTION' | 'COUNSELOR_ORG' | 'ENTERPRISE';
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL';
  settings?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const tenantSchema = new Schema<ITenant>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  type: { type: String, enum: ['INSTITUTION', 'COUNSELOR_ORG', 'ENTERPRISE'], required: true },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED', 'TRIAL'], default: 'ACTIVE' },
  settings: { type: Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export const Tenant = mongoose.model<ITenant>('Tenant', tenantSchema);
