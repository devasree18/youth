import mongoose, { Schema, Document } from 'mongoose';

export type GameType = 'BREATHING_FLOW' | 'FOCUS_TAP' | 'MOOD_MATCH';
export type GameStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

export interface GameReflection {
  question?: string;
  response?: string;
  savedAt?: Date;
}

export interface IGameSession extends Document {
  userId: mongoose.Types.ObjectId;
  tenantId?: mongoose.Types.ObjectId;
  gameType: GameType;
  startedAt: Date;
  completedAt?: Date;
  durationSeconds: number;
  status: GameStatus;
  resultSummary?: string;
  accuracy?: number;
  preCheckin?: string;
  postCheckin?: string;
  reflection?: GameReflection;
  insight?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const gameSessionSchema = new Schema<IGameSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
    gameType: {
      type: String,
      enum: ['BREATHING_FLOW', 'FOCUS_TAP', 'MOOD_MATCH'],
      required: true,
      index: true,
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    durationSeconds: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['IN_PROGRESS', 'COMPLETED', 'ABANDONED'],
      default: 'IN_PROGRESS',
      index: true,
    },
    resultSummary: { type: String, trim: true, maxlength: 1000 },
    accuracy: { type: Number, min: 0, max: 100 },
    preCheckin: { type: String, trim: true, maxlength: 100 },
    postCheckin: { type: String, trim: true, maxlength: 100 },
    reflection: {
      question: { type: String, trim: true, maxlength: 300 },
      response: { type: String, trim: true, maxlength: 1000 },
      savedAt: { type: Date },
    },
    insight: { type: String, trim: true, maxlength: 500 },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

gameSessionSchema.index({ userId: 1, createdAt: -1 });
gameSessionSchema.index({ userId: 1, status: 1 });
gameSessionSchema.index({ userId: 1, gameType: 1 });

export const GameSession = mongoose.model<IGameSession>('GameSession', gameSessionSchema);
