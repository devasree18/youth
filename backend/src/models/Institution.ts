import mongoose, { Schema, Document } from 'mongoose';

export interface IInstitution extends Document {
  name: string;
  code: string;
  email: string;
  domain?: string;
  tenantId: mongoose.Types.ObjectId;
  adminUserId: mongoose.Types.ObjectId;
  status: 'ACTIVE' | 'INACTIVE';
  tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
  createdAt: Date;
  updatedAt: Date;
}

const institutionSchema = new Schema<IInstitution>({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  domain: { type: String, lowercase: true, trim: true },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  adminUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  tier: { type: String, enum: ['STANDARD', 'PREMIUM', 'ENTERPRISE'], default: 'STANDARD' }
}, { timestamps: true });

export const Institution = mongoose.model<IInstitution>('Institution', institutionSchema);
