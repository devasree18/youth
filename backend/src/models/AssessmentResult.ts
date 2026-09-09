import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessmentResult extends Document {
  userId: mongoose.Types.ObjectId;
  tenantId?: mongoose.Types.ObjectId;
  templateCode: string;
  templateVersion: number;
  answers: { questionId: string; selectedValue: number }[];
  totalScore: number;
  maxPossibleScore: number;
  normalizedScore: number; // 0 to 100
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRISIS';
  interpretationLabel: string;
  summary: string;
  recommendations: string[];
  createdAt: Date;
  updatedAt: Date;
}

const assessmentResultSchema = new Schema<IAssessmentResult>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
  templateCode: { type: String, required: true },
  templateVersion: { type: Number, required: true },
  answers: [{
    questionId: { type: String, required: true },
    selectedValue: { type: Number, required: true }
  }],
  totalScore: { type: Number, required: true },
  maxPossibleScore: { type: Number, required: true },
  normalizedScore: { type: Number, required: true, min: 0, max: 100 },
  riskLevel: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'CRISIS'], default: 'LOW' },
  interpretationLabel: { type: String, required: true },
  summary: { type: String, required: true },
  recommendations: [{ type: String }]
}, { timestamps: true });

assessmentResultSchema.index({ userId: 1, createdAt: -1 });

export const AssessmentResult = mongoose.model<IAssessmentResult>('AssessmentResult', assessmentResultSchema);

// Backward compatibility export alias
export const Assessment = AssessmentResult;
