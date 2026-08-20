import mongoose from 'mongoose';

const counselorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  availability: { type: String, required: true },
  consultationType: { type: String, enum: ['online', 'in-person', 'both'], required: true },
  price: { type: Number, required: true },
  languages: [{ type: String }],
  description: { type: String },
  image: { type: String }
}, { timestamps: true });

export const Counselor = mongoose.model('Counselor', counselorSchema);
