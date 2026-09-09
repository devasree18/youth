import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  targetType: 'POST' | 'COMMENT';
  targetId: mongoose.Types.ObjectId;
  reportedBy: mongoose.Types.ObjectId;
  reason: 'HARASSMENT' | 'SELF_HARM' | 'SPAM' | 'INAPPROPRIATE' | 'OTHER';
  details?: string;
  status: 'PENDING' | 'REVIEWED' | 'ACTIONED';
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>({
  targetType: { type: String, enum: ['POST', 'COMMENT'], required: true },
  targetId: { type: Schema.Types.ObjectId, required: true, index: true },
  reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { 
    type: String, 
    enum: ['HARASSMENT', 'SELF_HARM', 'SPAM', 'INAPPROPRIATE', 'OTHER'], 
    required: true 
  },
  details: { type: String, trim: true, maxlength: 500 },
  status: { type: String, enum: ['PENDING', 'REVIEWED', 'ACTIONED'], default: 'PENDING', index: true }
}, { timestamps: true });

export const Report = mongoose.model<IReport>('Report', reportSchema);
