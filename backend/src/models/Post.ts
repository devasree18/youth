import mongoose, { Schema, Document } from 'mongoose';

export type PostStatus = 'active' | 'hidden' | 'under_review' | 'removed';

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  tenantId?: mongoose.Types.ObjectId;
  pseudonym: string;
  category: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  reportsCount: number;
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
  pseudonym: { type: String, required: true, trim: true },
  category: { type: String, default: 'General', index: true },
  content: { type: String, required: true, trim: true, maxlength: 2000 },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  reportsCount: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['active', 'hidden', 'under_review', 'removed'], 
    default: 'active',
    index: true 
  }
}, { timestamps: true });

postSchema.index({ status: 1, createdAt: -1 });

export const Post = mongoose.model<IPost>('Post', postSchema);
