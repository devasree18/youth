import mongoose from 'mongoose';

const moodEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: String, enum: ['Very Low', 'Low', 'Okay', 'Good', 'Great'], required: true },
  note: { type: String },
}, { timestamps: true });

export const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema);
