import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  pseudonym: string;
  content: string;
  reportsCount: number;
  status: 'active' | 'hidden' | 'removed';
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>({
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  pseudonym: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true, maxlength: 1000 },
  reportsCount: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'hidden', 'removed'], default: 'active', index: true }
}, { timestamps: true });

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
