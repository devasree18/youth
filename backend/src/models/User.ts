import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  assessments: [{
    date: { type: Date, default: Date.now },
    result: { type: String }
  }]
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
