import type { LucideIcon } from 'lucide-react';
import type { GameType, GameStatus } from '../../../services/gameService';

export type GameScreenState = 'intro' | 'playing' | 'paused' | 'completed' | 'error';

export interface GameDefinition {
  type: GameType;
  title: string;
  tagline: string;
  description: string;
  durationLabel: string;
  defaultDurationSeconds: number;
  badge: string;
  icon: LucideIcon;
  accentColor: string;
  category: 'FOCUS' | 'CALM' | 'BALANCE';
}

export interface FocusOrbitMetrics {
  totalTaps: number;
  successfulTaps: number;
  averageReactionMs: number;
  reactionTimeConsistency: 'steady' | 'variable' | 'rhythmic';
  reactionTimes: number[];
  sessionDuration: number;
  pausedCount: number;
}

export interface CalmGardenMetrics {
  seedsPlanted: number;
  plantsWatered: number;
  leavesCleared: number;
  interactionsCount: number;
  growthProgress: number; // 0 to 100
  sessionDuration: number;
  pausedCount: number;
}

export interface PathOfBalanceMetrics {
  itemsCollected: string[];
  routeSelected: string;
  obstaclesAvoided: number;
  timeSpent: number;
  restartCount: number;
  pausedCount: number;
  endingScene: string;
}

export type AnyGameMetrics =
  | FocusOrbitMetrics
  | CalmGardenMetrics
  | PathOfBalanceMetrics
  | Record<string, any>;

export interface GameCompletionPayload {
  status: GameStatus;
  durationSeconds: number;
  resultSummary: string;
  accuracy?: number;
  metrics: AnyGameMetrics;
  postCheckin?: string;
  reflection?: {
    question?: string;
    response?: string;
  };
}

export interface ActiveGameProps {
  onComplete: (payload: GameCompletionPayload) => Promise<void>;
  onExit: () => void;
  isSaving?: boolean;
}
