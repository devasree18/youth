import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { wellbeingService, type WellbeingSummary } from '../services/wellbeingService';
import { moodService } from '../services/moodService';
import { AppShell } from '../components/layout/AppShell';
import { 
  MessageSquare, 
  BookOpen, 
  Activity, 
  Users, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  PhoneCall,
  ShieldCheck,
  UserCheck,
  Square,
  Flame
} from 'lucide-react';

interface MicroAction {
  id: string;
  label: string;
  category: string;
}

const INITIAL_ACTIONS: MicroAction[] = [
  { id: 'act-1', label: 'Practice 5-minute Pomodoro study break', category: 'Focus & Rest' },
  { id: 'act-2', label: 'Read article on managing exam anxiety', category: 'Learning' },
  { id: 'act-3', label: 'Record evening reflection journal', category: 'Mindfulness' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [summary, setSummary] = useState<WellbeingSummary | null>(null);
  const [isSavingMood, setIsSavingMood] = useState(false);
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  const moodOptions = [
    { label: 'Exhausted', emoji: '😔', value: 'very_low', score: 35, bg: 'hover:bg-rose-50 hover:border-rose-300 text-rose-700' },
    { label: 'Stressed', emoji: '😟', value: 'low', score: 52, bg: 'hover:bg-amber-50 hover:border-amber-300 text-amber-700' },
    { label: 'Neutral', emoji: '😐', value: 'okay', score: 70, bg: 'hover:bg-slate-100 hover:border-slate-300 text-slate-700' },
    { label: 'Good', emoji: '🙂', value: 'good', score: 85, bg: 'hover:bg-blue-50 hover:border-blue-300 text-blue-700' },
    { label: 'Great', emoji: '😄', value: 'great', score: 96, bg: 'hover:bg-emerald-50 hover:border-emerald-300 text-emerald-700' },
  ];

  const fetchWellbeingSummary = useCallback(async () => {
    try {
      const res = await wellbeingService.getSummary();
      if (res.data) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch wellbeing summary:', err);
    }
  }, []);

  useEffect(() => {
    fetchWellbeingSummary();
  }, [fetchWellbeingSummary]);

  const handleMoodSelect = async (moodValue: string) => {
    setSelectedMood(moodValue);
    setIsSavingMood(true);
    try {
      await moodService.recordMood(moodValue);
      await fetchWellbeingSummary();
    } catch (err) {
      console.error('Failed to record mood:', err);
    } finally {
      setIsSavingMood(false);
    }
  };

  const toggleAction = (id: string) => {
    setCompletedActions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Calculate dynamic Wellbeing Score based on real backend summary + instant mood selection + action bonuses
  const baseScore = summary?.wellbeingScore ?? 70;
  
  // Mood modifier preview if selected
  const selectedMoodObj = moodOptions.find(m => m.value === selectedMood);
  const moodScore = selectedMoodObj ? selectedMoodObj.score : baseScore;
  
  // Action bonus (+5 points for each checked action)
  const actionBonus = Object.values(completedActions).filter(Boolean).length * 5;
  const currentScore = Math.min(100, Math.max(10, moodScore + actionBonus));

  // Dynamic score labels & color shifts
  const getScoreMeta = (score: number) => {
    if (score >= 80) return { label: 'Optimal Wellbeing', color: '#10b981', bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (score >= 65) return { label: 'Good', color: '#2563eb', bgClass: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (score >= 50) return { label: 'Moderate', color: '#f59e0b', bgClass: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'Needs Attention', color: '#f43f5e', bgClass: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const scoreMeta = getScoreMeta(currentScore);

  // Dynamic recommendation based on current active score
  const getDynamicRecommendation = (score: number) => {
    if (score >= 85) return 'Great momentum! You are maintaining strong wellbeing routines. Keep up your balanced habits.';
    if (score >= 70) return 'Your wellbeing index is solid. Try taking a short walk or practicing a 5-minute Pomodoro break between study blocks.';
    if (score >= 50) return 'Your score shows moderate stress. Explore our curated resource hub guides or chat with our 24/7 AI Companion.';
    return 'Your self-reported wellbeing is lower than usual. We recommend reaching out to a verified campus counselor or emergency support.';
  };

  const activeRecommendation = getDynamicRecommendation(currentScore);
  const completedCount = Object.values(completedActions).filter(Boolean).length;

  return (
    <AppShell 
      title={`Welcome back, ${user?.name?.split(' ')[0] || 'User'}`}
      subtitle="Here is your personal wellbeing overview and real-time score indicator."
    >
      <div className="space-y-6">
        
        {/* Top Banner Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Mental Health & Wellbeing Hub</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Track, Reflect, & Empower Your Daily Mindset
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Log daily mood check-ins, connect with verified campus counselors, or chat 24/7 with your confidential AI companion.
            </p>
          </div>

          <div className="relative z-10 flex items-center space-x-3 shrink-0">
            <Link 
              to="/assessment" 
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center space-x-2 active:scale-[0.98]"
            >
              <Activity className="w-4 h-4 text-white" />
              <span>Start Assessment</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Column (Left - 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Mood Tracker (Updates Dynamic Score Live) */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">How are you feeling right now?</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Select a mood rating to calculate your real-time score live</p>
                </div>
                {isSavingMood && <span className="text-xs font-bold text-blue-600 animate-pulse">Syncing...</span>}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {moodOptions.map((mood) => {
                  const isSelected = selectedMood === mood.value;
                  return (
                    <button
                      key={mood.value}
                      disabled={isSavingMood}
                      onClick={() => handleMoodSelect(mood.value)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all ${mood.bg} ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-50/70 font-bold ring-2 ring-blue-500/20 scale-[1.02] shadow-sm' 
                          : 'border-slate-200/80 bg-slate-50/50'
                      }`}
                    >
                      <span className="text-2xl mb-1">{mood.emoji}</span>
                      <span className="text-xs font-bold">{mood.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick Feature Modules Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <Link to="/ai-assistant" className="group">
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">24/7 AI</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm mb-1">Safe AI Companion</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">Private, empathetic dialogue & coping strategies.</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                    <span>Start conversation</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              <Link to="/resources" className="group">
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">Library</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm mb-1">Resource Hub</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">Evidence-based guides on stress & study balance.</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-600">
                    <span>Explore articles</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              <Link to="/counselors" className="group">
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">Licensed</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm mb-1">Campus Counselors</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">Book confidential 1-on-1 consultations.</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                    <span>Book session</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              <Link to="/community" className="group">
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">Anonymous</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm mb-1">Peer Community</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">Safe pseudonymous discussion channels.</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600">
                    <span>Join discussion</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

            </div>

          </div>

          {/* Sidebar Column (Right - 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* DYNAMIC WELLBEING INDEX CARD */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
              
              <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>DYNAMIC WELLBEING INDEX</span>
              </div>

              {/* Dynamic Radial SVG Gauge */}
              <div className="relative inline-flex items-center justify-center mb-4">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="66" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                  <motion.circle 
                    cx="80" 
                    cy="80" 
                    r="66" 
                    fill="transparent" 
                    stroke={scoreMeta.color} 
                    strokeWidth="12" 
                    strokeDasharray="415" 
                    animate={{ strokeDashoffset: 415 - (415 * currentScore) / 100 }} 
                    transition={{ duration: 0.8, ease: "easeOut" }} 
                    strokeLinecap="round"
                  />
                </svg>
                
                <div className="absolute flex flex-col items-center">
                  <motion.span 
                    key={currentScore}
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl font-black text-slate-900 tracking-tight"
                  >
                    {currentScore}
                  </motion.span>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">OUT OF 100</span>
                </div>
              </div>

              {/* Dynamic Score Label Pill */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={scoreMeta.label}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -5, opacity: 0 }}
                  className={`inline-block px-4 py-1.5 rounded-full text-xs font-extrabold border mb-4 ${scoreMeta.bgClass}`}
                >
                  {scoreMeta.label}
                </motion.div>
              </AnimatePresence>

              {/* Dynamic Recommendation Box */}
              <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-600 text-left w-full border border-slate-100">
                <span className="font-extrabold text-slate-900 block mb-1">Recommended Action:</span>
                <p className="leading-relaxed font-medium">{activeRecommendation}</p>
              </div>
            </div>

            {/* Daily Interactive Micro-Actions Checklist */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-extrabold text-slate-900 text-sm">Daily Wellbeing Micro-Actions</h3>
                {completedCount > 0 && (
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center">
                    <Flame className="w-3 h-3 mr-1 fill-emerald-600 text-emerald-600" />
                    +{completedCount * 5} Score Boost
                  </span>
                )}
              </div>
              
              <div className="space-y-2">
                {INITIAL_ACTIONS.map(act => {
                  const isChecked = !!completedActions[act.id];
                  return (
                    <button
                      key={act.id}
                      onClick={() => toggleAction(act.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold border transition-all text-left ${
                        isChecked 
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-bold' 
                          : 'bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className={isChecked ? 'line-through text-slate-600' : ''}>{act.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0 pl-2">{act.category}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Emergency Hotline Box */}
            <div className="bg-rose-50 border border-rose-200/80 rounded-3xl p-5 text-rose-900 flex items-center justify-between shadow-sm">
              <div>
                <div className="flex items-center space-x-1.5 text-xs font-extrabold text-rose-700 mb-0.5">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span>24/7 Tele-MANAS Line</span>
                </div>
                <p className="text-[11px] text-rose-600 font-semibold">Toll-free national crisis hotline</p>
              </div>

              <a 
                href="tel:14416"
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors flex items-center space-x-1 shadow-sm active:scale-[0.98]"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>14416</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;



