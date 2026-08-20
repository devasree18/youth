import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: ['free', 'standard', 'premium'], required: true },
  status: { type: String, enum: ['active', 'cancelled', 'past_due'], default: 'active' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date }
}, { timestamps: true });

export const Subscription = mongoose.model('Subscription', subscriptionSchema);
