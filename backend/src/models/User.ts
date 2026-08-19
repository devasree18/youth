import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  assessments: [{
    date: { type: Date, default: Date.now },
    result: { type: String }
  }]
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
