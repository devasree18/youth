import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'counselor', 'institution', 'admin'], default: 'student' },
  preferences: { type: Map, of: String, default: {} },
  supportNeeds: [{ type: String }],
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
