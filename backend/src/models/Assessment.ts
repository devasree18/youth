import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  responses: { type: Map, of: String, required: true },
  score: { type: Number, required: true },
  results: { type: Map, of: String },
  riskLevel: { type: String, enum: ['low', 'moderate', 'high'], default: 'low' },
}, { timestamps: true });

export const Assessment = mongoose.model('Assessment', assessmentSchema);
