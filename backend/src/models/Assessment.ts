import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, default: 'general' },
  responses: { type: Map, of: String, default: {} },
  score: { type: Number },
  results: { type: Map, of: String },
  riskLevel: { type: String, enum: ['low', 'moderate', 'high'], default: 'low' },
}, { timestamps: true });

export const Assessment = mongoose.model('Assessment', assessmentSchema);
