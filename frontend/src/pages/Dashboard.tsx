import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { wellbeingService, type WellbeingSummary } from '../services/wellbeingService';
import { moodService } from '../services/moodService';
import { Navbar } from '../components/layout/Navbar';
import { 
  MessageSquare, 
  BookOpen, 
  Activity, 
  Users, 
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [summary, setSummary] = useState<WellbeingSummary | null>(null);
  const [isSavingMood, setIsSavingMood] = useState(false);

  const moodOptions = [
    { label: 'Exhausted', emoji: '😢', value: 'very_low', color: 'bg-red-50 text-red-700 border-red-200' },
    { label: 'Stressed', emoji: '😕', value: 'low', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { label: 'Okay', emoji: '😐', value: 'okay', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    { label: 'Good', emoji: '🙂', value: 'good', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'Energized', emoji: '😄', value: 'great', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
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

  const currentScore = summary?.wellbeingScore ?? 78;
  const scoreLabel = summary?.scoreLabel ?? 'Balanced';

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans relative overflow-x-hidden flex flex-col">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-50" 
        style={{
          backgroundImage: 'radial-gradient(#d1d5db 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Shared Navigation Header */}
      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Welcome Banner */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Student Wellness Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-slate-600 text-sm mt-1">Here is your daily wellbeing overview and mental health progress.</p>
          </div>

          <div className="flex items-center space-x-3">
            <Link 
              to="/assessment" 
              className="px-6 py-3 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-md flex items-center space-x-2"
            >
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>Start Assessment Check-in</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Area (Left) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Daily Mood Check-in Card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">How are you feeling today?</h2>
                  <p className="text-xs text-slate-500">Record your current mood to update your weekly score</p>
                </div>
                {isSavingMood && <span className="text-xs font-bold text-indigo-600 animate-pulse">Logging...</span>}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    disabled={isSavingMood}
                    onClick={() => handleMoodSelect(mood.value)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all hover:scale-105 active:scale-95 ${mood.color} ${
                      selectedMood === mood.value ? 'ring-2 ring-indigo-500 font-bold shadow-md bg-white' : 'bg-slate-50/50 hover:bg-white'
                    }`}
                  >
                    <span className="text-2xl mb-1">{mood.emoji}</span>
                    <span className="text-xs font-semibold">{mood.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Core Modules Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <Link to="/ai-assistant" className="group">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">24/7 AI</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">AI Support Companion</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Confidential, non-judgmental guidance and coping techniques.</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                    <span>Chat Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              <Link to="/resources" className="group">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">Curated</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">Student Resource Hub</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Evidence-based guides for academic stress and burnout.</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
                    <span>Explore Articles</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              <Link to="/counselors" className="group">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">Verified</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">Counselor Booking</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Book confidential 1-on-1 sessions with licensed specialists.</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
                    <span>Book Session</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              <Link to="/community" className="group">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Users className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">Anonymous</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">Peer Support Forum</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Share experiences and encouragement safely with peers.</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600">
                    <span>Join Discussion</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

            </div>

          </div>

          {/* Sidebar Metrics (Right) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Dynamic Wellbeing Gauge Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col items-center text-center"
            >
              <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
                <TrendingUp className="w-4 h-4" />
                <span>Wellbeing Score</span>
              </div>

              <div className="relative inline-flex items-center justify-center mb-6">
                <svg className="w-44 h-44 transform -rotate-90">
                  <circle cx="88" cy="88" r="76" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                  <circle 
                    cx="88" 
                    cy="88" 
                    r="76" 
                    fill="transparent" 
                    stroke="#6366f1" 
                    strokeWidth="12" 
                    strokeDasharray="477.5" 
                    strokeDashoffset={477.5 - (477.5 * currentScore) / 100} 
                    className="transition-all duration-1000 ease-out" 
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-5xl font-black tracking-tight">{currentScore}</span>
                  <span className="text-xs text-indigo-300 font-bold uppercase mt-1">/ 100 Score</span>
                </div>
              </div>

              <div className="inline-block bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 px-4 py-1.5 rounded-full text-xs font-bold mb-4">
                Status: {scoreLabel}
              </div>

              {summary?.recommendations && summary.recommendations.length > 0 && (
                <div className="bg-slate-800/80 rounded-2xl p-4 text-xs text-slate-300 text-left w-full border border-slate-700">
                  <span className="font-bold text-white block mb-1">Recommended Action:</span>
                  <p>{summary.recommendations[0]}</p>
                </div>
              )}
            </motion.div>

            {/* Daily Safety Reminder Card */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-emerald-900">
              <div className="flex items-center space-x-2 font-bold text-sm mb-2 text-emerald-800">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Daily Wellness Tip</span>
              </div>
              <p className="text-xs leading-relaxed text-emerald-700">
                Taking 10 minutes for mindful breathing or a short walk significantly reduces academic stress and boosts focus.
              </p>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;

