import mongoose, { Schema, Document } from 'mongoose';

export type MoodValue = 'very_low' | 'low' | 'okay' | 'good' | 'great';

export interface IMoodEntry extends Document {
  userId: mongoose.Types.ObjectId;
  tenantId?: mongoose.Types.ObjectId;
  mood: MoodValue;
  score: number; // 1 to 5 numeric mapping
  note?: string;
  factors?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const moodEntrySchema = new Schema<IMoodEntry>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
  mood: { 
    type: String, 
    enum: ['very_low', 'low', 'okay', 'good', 'great'], 
    required: true 
  },
  score: { type: Number, required: true, min: 1, max: 5 },
  note: { type: String, trim: true, maxlength: 500 },
  factors: [{ type: String }]
}, { timestamps: true });

moodEntrySchema.index({ userId: 1, createdAt: -1 });

export const MoodEntry = mongoose.model<IMoodEntry>('MoodEntry', moodEntrySchema);
