import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  readTime: { type: Number },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export const Resource = mongoose.model('Resource', resourceSchema);
