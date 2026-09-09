import mongoose, { Schema, Document } from 'mongoose';

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface IAppointment extends Document {
  counselorId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  tenantId?: mongoose.Types.ObjectId;
  scheduledAt: Date;
  durationMinutes: number;
  consultationType: 'online' | 'in_person';
  status: AppointmentStatus;
  notes?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>({
  counselorId: { type: Schema.Types.ObjectId, ref: 'Counselor', required: true, index: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
  scheduledAt: { type: Date, required: true, index: true },
  durationMinutes: { type: Number, default: 45 },
  consultationType: { type: String, enum: ['online', 'in_person'], default: 'online' },
  status: { 
    type: String, 
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'], 
    default: 'CONFIRMED',
    index: true 
  },
  notes: { type: String, trim: true, maxlength: 500 },
  cancellationReason: { type: String, trim: true }
}, { timestamps: true });

// Prevent double booking at the database index level
appointmentSchema.index({ counselorId: 1, scheduledAt: 1 }, { unique: true });

export const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);
