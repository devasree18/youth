import mongoose, { Schema, Document } from 'mongoose';

export interface IAvailabilitySlot {
  dayOfWeek: number; // 0 (Sun) to 6 (Sat)
  startTime: string; // "09:00"
  endTime: string;   // "10:00"
  isBooked?: boolean;
}

export interface ICounselor extends Document {
  userId?: mongoose.Types.ObjectId;
  tenantId?: mongoose.Types.ObjectId;
  name: string;
  specialization: string;
  qualifications: string[];
  languages: string[];
  consultationType: 'online' | 'in_person' | 'both';
  price: number;
  currency: string;
  rating: number;
  reviewsCount: number;
  description: string;
  avatarUrl?: string;
  availabilitySlots: IAvailabilitySlot[];
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

const counselorSchema = new Schema<ICounselor>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
  name: { type: String, required: true, trim: true },
  specialization: { type: String, required: true, index: true },
  qualifications: [{ type: String }],
  languages: [{ type: String }],
  consultationType: { 
    type: String, 
    enum: ['online', 'in_person', 'both'], 
    default: 'online',
    index: true 
  },
  price: { type: Number, required: true, default: 0 },
  currency: { type: String, default: 'INR' },
  rating: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 0 },
  description: { type: String, trim: true },
  avatarUrl: { type: String },
  availabilitySlots: [{
    dayOfWeek: { type: Number, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isBooked: { type: Boolean, default: false }
  }],
  verificationStatus: { 
    type: String, 
    enum: ['PENDING', 'VERIFIED', 'REJECTED'], 
    default: 'VERIFIED',
    index: true 
  }
}, { timestamps: true });

export const Counselor = mongoose.model<ICounselor>('Counselor', counselorSchema);
