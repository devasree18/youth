import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  id: string;
  text: string;
  category?: string;
  options: { label: string; value: number }[];
}

export interface IInterpretationThreshold {
  minScore: number;
  maxScore: number;
  label: string; // e.g. "Low Stress", "Moderate Stress", "High Stress"
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRISIS';
  summary: string;
  recommendations: string[];
}

export interface IAssessmentTemplate extends Document {
  code: string; // e.g. "WELLBEING_CHECKIN_V1", "STRESS_GHQ"
  title: string;
  description: string;
  version: number;
  questions: IQuestion[];
  scoringThresholds: IInterpretationThreshold[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const assessmentTemplateSchema = new Schema<IAssessmentTemplate>({
  code: { type: String, required: true, unique: true, uppercase: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  version: { type: Number, required: true, default: 1 },
  questions: [{
    id: { type: String, required: true },
    text: { type: String, required: true },
    category: { type: String },
    options: [{
      label: { type: String, required: true },
      value: { type: Number, required: true }
    }]
  }],
  scoringThresholds: [{
    minScore: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    label: { type: String, required: true },
    riskLevel: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'CRISIS'], required: true },
    summary: { type: String, required: true },
    recommendations: [{ type: String }]
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const AssessmentTemplate = mongoose.model<IAssessmentTemplate>('AssessmentTemplate', assessmentTemplateSchema);

// Backward-compatibility export
export { AssessmentResult as Assessment } from './AssessmentResult';
