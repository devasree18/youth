import mongoose, { Schema, Document } from 'mongoose';

export interface IMembership extends Document {
  userId: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  institutionId?: mongoose.Types.ObjectId;
  role: string;
  permissions: string[];
  status: 'ACTIVE' | 'INVITED' | 'REVOKED';
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const membershipSchema = new Schema<IMembership>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true },
  role: { type: String, required: true },
  permissions: [{ type: String }],
  status: { type: String, enum: ['ACTIVE', 'INVITED', 'REVOKED'], default: 'ACTIVE' },
  joinedAt: { type: Date, default: Date.now }
}, { timestamps: true });

membershipSchema.index({ userId: 1, tenantId: 1 }, { unique: true });

export const Membership = mongoose.model<IMembership>('Membership', membershipSchema);
