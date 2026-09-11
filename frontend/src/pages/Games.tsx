import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Target,
  Flower2,
  Compass,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Trash2,
  PhoneCall,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  FocusOrbitGame,
  CalmGardenGame,
  PathOfBalanceGame,
} from '../features/games';
import type { GameCompletionPayload } from '../features/games';
import { gameService } from '../services/gameService';
import type {
  GameSummary,
  GameType,
  UserPatternInsight,
  WellbeingRecommendation,
  CrisisAlert,
  GameSession,
} from '../services/gameService';
import { fadeUpVariants, staggerContainerVariants } from '../lib/motion';

interface GameItem {
  type: GameType;
  title: string;
  tagline: string;
  description: string;
  estimatedTime: string;
  icon: typeof Target;
  accentColor: string;
  badge: string;
}

const GAMES_LIST: GameItem[] = [
  {
    type: 'FOCUS_ORBIT',
    title: 'Focus Orbit',
    tagline: 'Reaction & Attention Reset',
    description:
      'Gently tap soft glowing orbs across the screen to practice present-moment awareness and steady attention.',
    estimatedTime: '45 secs',
    icon: Target,
    accentColor: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    badge: 'Reaction & Attention',
  },
  {
    type: 'CALM_GARDEN',
    title: 'Calm Garden',
    tagline: 'Stress-Relief Digital Sanctuary',
    description:
      'Plant gentle seeds, nurture them with rain droplets, and swipe away fallen leaves at your own soothing pace.',
    estimatedTime: '2–3 mins',
    icon: Flower2,
    accentColor: 'bg-teal-50 text-teal-600 border-teal-100',
    badge: 'Stress Relief & Calming',
  },
  {
    type: 'PATH_OF_BALANCE',
    title: 'Path of Balance',
    tagline: 'Mindful Decision Journey',
    description:
      'Guide your calm traveler along a scenic trail, collect restorative coping items, and explore what brings you balance.',
    estimatedTime: '60–90 secs',
    icon: Compass,
    accentColor: 'bg-violet-50 text-violet-600 border-violet-100',
    badge: 'Mindful Pacing & Choices',
  },
];

export const Games = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialGame = searchParams.get('game') as GameType | null;

  const [activeGame, setActiveGame] = useState<GameType | null>(initialGame);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [summary, setSummary] = useState<GameSummary | null>(null);
  const [patterns, setPatterns] = useState<UserPatternInsight[]>([]);
  const [recommendations, setRecommendations] = useState<WellbeingRecommendation[]>([]);
  const [sessionsList, setSessionsList] = useState<GameSession[]>([]);
  const [crisisAlert, setCrisisAlert] = useState<CrisisAlert | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [sumRes, patRes, sessRes] = await Promise.all([
        gameService.getSummary(),
        gameService.getPatterns(),
        gameService.getSessions(10),
      ]);

      if (sumRes.data) setSummary(sumRes.data);
      if (patRes.data) {
        setPatterns(patRes.data.patterns || []);
        setRecommendations(patRes.data.recommendations || []);
      }
      if (sessRes.data) setSessionsList(sessRes.data);
    } catch (e) {
      console.error('Failed to load games data:', e);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Start a new authenticated game session
  const handleSelectGame = async (type: GameType) => {
    try {
      setActiveGame(type);
      setSearchParams({ game: type });
      const res = await gameService.startSession(type);
      if (res.data?._id) {
        setActiveSessionId(res.data._id);
      }
    } catch (err) {
      console.error('Could not start game session on backend:', err);
    }
  };

  // Complete an active game session
  const handleGameComplete = async (payload: GameCompletionPayload) => {
    if (!activeSessionId) return;

    try {
      setIsSaving(true);
      const res = await gameService.completeSession(activeSessionId, {
        status: payload.status,
        durationSeconds: payload.durationSeconds,
        resultSummary: payload.resultSummary,
        accuracy: payload.accuracy,
        metrics: payload.metrics,
        postCheckin: payload.postCheckin,
        reflection: payload.reflection,
      });

      if (res.data?.crisisAlert?.isCrisis) {
        setCrisisAlert(res.data.crisisAlert);
      }

      await fetchData();
    } catch (err) {
      console.error('Failed to complete game session:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExitGame = () => {
    setActiveGame(null);
    setActiveSessionId(null);
    setSearchParams({});
    fetchData();
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      setDeletingId(sessionId);
      await gameService.deleteSession(sessionId);
      setSessionsList((prev) => prev.filter((s) => s._id !== sessionId));
      fetchData();
    } catch (e) {
      console.error('Failed to delete session:', e);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AppShell
      title="Reset Games"
      subtitle="Engaging, calm mini-games to pause, focus, and reset during your day."
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Urgent Crisis Intercept Modal */}
        {crisisAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-rose-200 shadow-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center space-x-3 text-rose-600">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-200">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-rose-950">Immediate Support Available</h3>
                  <p className="text-xs text-rose-700">You are not alone. Free, confidential help is 24/7.</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {crisisAlert.message}
              </p>

              <div className="space-y-2 pt-2">
                <div className="p-3 bg-rose-50/80 rounded-2xl border border-rose-200 space-y-1 text-xs">
                  <p className="font-bold text-rose-900">National Helplines:</p>
                  <p className="text-[11px] text-rose-800">• Tele-MANAS: <a href="tel:14416" className="font-bold underline">14416</a></p>
                  <p className="text-[11px] text-rose-800">• KIRAN Helpline: <a href="tel:18005990019" className="font-bold underline">1800-599-0019</a></p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCrisisAlert(null)}
                  className="text-xs text-slate-500"
                >
                  Close
                </Button>
                <Link to="/crisis">
                  <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs">
                    Access Crisis Care
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Active Game Experience */}
        {activeGame ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full"
          >
            {activeGame === 'FOCUS_ORBIT' && (
              <FocusOrbitGame
                onComplete={handleGameComplete}
                onExit={handleExitGame}
                isSaving={isSaving}
              />
            )}
            {activeGame === 'CALM_GARDEN' && (
              <CalmGardenGame
                onComplete={handleGameComplete}
                onExit={handleExitGame}
                isSaving={isSaving}
              />
            )}
            {activeGame === 'PATH_OF_BALANCE' && (
              <PathOfBalanceGame
                onComplete={handleGameComplete}
                onExit={handleExitGame}
                isSaving={isSaving}
              />
            )}
          </motion.div>
        ) : (
          /* Main Reset Hub View */
          <>
            {/* Mindful Reset Hero Banner */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeUpVariants}
              className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-teal-50/50 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center space-x-2">
                  <Badge variant="primary" dot size="sm">
                    Playable Mindful Resets
                  </Badge>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#172033] tracking-tight">
                  Take a calm pause when pressure builds.
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Real, engaging browser mini-games designed for short study breaks. No competitive rankings, no scores, and no clinical diagnoses.
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-white border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-6 h-6" />
              </div>
            </motion.div>

            {/* Dynamic Recommendations Banner */}
            {recommendations.length > 0 && (
              <motion.div
                initial="initial"
                animate="animate"
                variants={fadeUpVariants}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    A self-reflection insight
                  </span>
                  <h4 className="text-sm font-bold text-[#172033]">
                    {recommendations[0].title}
                  </h4>
                  <p className="text-xs text-slate-500 font-normal max-w-xl">
                    {recommendations[0].description}
                  </p>
                </div>

                <Link to={recommendations[0].actionRoute} className="shrink-0 w-full sm:w-auto">
                  <Button size="sm" className="w-full sm:w-auto font-bold text-xs shadow-xs">
                    <span>{recommendations[0].actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </motion.div>
            )}

            {/* Three Real Playable Games Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select a Mini-Game
                </h3>
                <span className="text-[11px] font-medium text-slate-400">3 playable resets</span>
              </div>

              <motion.div
                initial="initial"
                animate="animate"
                variants={staggerContainerVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-5"
              >
                {GAMES_LIST.map((game) => {
                  const Icon = game.icon;
                  return (
                    <motion.div key={game.type} variants={fadeUpVariants}>
                      <Card
                        hoverable
                        onClick={() => handleSelectGame(game.type)}
                        className="p-6 h-full flex flex-col justify-between border-slate-200/90 hover:border-indigo-300 transition-all rounded-3xl shadow-xs cursor-pointer group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div
                              className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs ${game.accentColor}`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <Badge variant="neutral" size="sm">
                              {game.badge}
                            </Badge>
                          </div>

                          <h4 className="text-base font-bold text-[#172033] mb-1.5 group-hover:text-indigo-600 transition-colors">
                            {game.title}
                          </h4>
                          <p className="text-xs text-slate-500 leading-relaxed font-normal">
                            {game.description}
                          </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-semibold">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{game.estimatedTime}</span>
                          </div>

                          <Button
                            size="sm"
                            className="font-bold text-xs shadow-xs px-3.5 group-hover:bg-indigo-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectGame(game.type);
                            }}
                          >
                            <span>Play</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Mindful Summary Metrics (if exists) */}
            {summary && summary.totalSessions > 0 && (
              <motion.div
                initial="initial"
                animate="animate"
                variants={fadeUpVariants}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-xs font-bold text-[#172033]">Your Mindful Activity</h4>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Non-diagnostic reflection
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-center">
                    <span className="text-base font-extrabold text-indigo-700 block">{summary.totalSessions}</span>
                    <span className="text-[10px] font-semibold text-slate-500">Completed Resets</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-teal-50/50 border border-teal-100 text-center">
                    <span className="text-base font-extrabold text-teal-700 block">{summary.totalMinutes}m</span>
                    <span className="text-[10px] font-semibold text-slate-500">Mindful Minutes</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-violet-50/50 border border-violet-100 text-center">
                    <span className="text-base font-extrabold text-violet-700 block">{summary.weeklyResetCount}</span>
                    <span className="text-[10px] font-semibold text-slate-500">This Week</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* "Your Patterns" Insights Area */}
            {patterns.length > 0 && (
              <motion.div
                initial="initial"
                animate="animate"
                variants={fadeUpVariants}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-xs font-bold text-[#172033]">Self-Reflection Patterns</h4>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Observed coping choices
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {patterns.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-1 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#172033]">{p.title}</span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {p.confidenceLabel}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                        {p.description}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Privacy & Consent Safe Notice */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/70 flex items-start space-x-3 text-xs text-indigo-950">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-indigo-900">Student Privacy & Consent</p>
                <p className="text-[11px] text-indigo-800 leading-relaxed font-normal">
                  Your mini-game activity is stored privately as non-clinical wellness signals. YOUTH never diagnoses medical conditions or publishes rankings. You can inspect or delete any session below.
                </p>
              </div>
            </div>

            {/* Session History & Student Data Control */}
            {sessionsList.length > 0 && (
              <motion.div
                initial="initial"
                animate="animate"
                variants={fadeUpVariants}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-[#172033]">Recent Reset History</h4>
                  <span className="text-[11px] text-slate-400">Manage your data</span>
                </div>

                <div className="space-y-2">
                  {sessionsList.map((s) => (
                    <div
                      key={s._id}
                      className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                          {s.gameType === 'FOCUS_ORBIT' && <Target className="w-3.5 h-3.5 text-indigo-600" />}
                          {s.gameType === 'CALM_GARDEN' && <Flower2 className="w-3.5 h-3.5 text-teal-600" />}
                          {s.gameType === 'PATH_OF_BALANCE' && <Compass className="w-3.5 h-3.5 text-violet-600" />}
                          {!['FOCUS_ORBIT', 'CALM_GARDEN', 'PATH_OF_BALANCE'].includes(s.gameType) && (
                            <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-[#172033] capitalize truncate">
                            {s.gameType.replace('_', ' ').toLowerCase()}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {new Date(s.createdAt).toLocaleDateString()} · {Math.round((s.durationSeconds || 0))}s
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteSession(s._id)}
                        disabled={deletingId === s._id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                        title="Delete session"
                        aria-label="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
};

export default Games;
