import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  tenantId?: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  provider: 'razorpay' | 'stripe';
  providerOrderId: string;
  providerPaymentId?: string;
  providerSignature?: string;
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED';
  rawPayload?: any;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  provider: { type: String, enum: ['razorpay', 'stripe'], required: true },
  providerOrderId: { type: String, required: true, index: true },
  providerPaymentId: { type: String },
  providerSignature: { type: String },
  status: { type: String, enum: ['PENDING', 'SUCCEEDED', 'FAILED'], default: 'PENDING', index: true },
  rawPayload: { type: Schema.Types.Mixed }
}, { timestamps: true });

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
