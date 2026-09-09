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
  CheckCircle2,
  PhoneCall,
  ShieldCheck
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [summary, setSummary] = useState<WellbeingSummary | null>(null);
  const [isSavingMood, setIsSavingMood] = useState(false);

  const moodOptions = [
    { label: 'Exhausted', emoji: '😔', value: 'very_low', bg: 'hover:bg-rose-50 hover:border-rose-200 text-rose-700' },
    { label: 'Stressed', emoji: '😟', value: 'low', bg: 'hover:bg-amber-50 hover:border-amber-200 text-amber-700' },
    { label: 'Neutral', emoji: '😐', value: 'okay', bg: 'hover:bg-slate-100 hover:border-slate-300 text-slate-700' },
    { label: 'Good', emoji: '🙂', value: 'good', bg: 'hover:bg-blue-50 hover:border-blue-200 text-blue-700' },
    { label: 'Great', emoji: '😄', value: 'great', bg: 'hover:bg-emerald-50 hover:border-emerald-200 text-emerald-700' },
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
  const scoreLabel = summary?.scoreLabel ?? 'Optimal Wellbeing';

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Mental Health & Wellbeing Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">Here is your daily mental health status and recommended wellness actions.</p>
          </div>

          <div className="flex items-center space-x-3">
            <Link 
              to="/assessment" 
              className="px-5 py-3 rounded-full bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all shadow-sm flex items-center space-x-2"
            >
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>Take Check-in Assessment</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Column (Left - 7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Mood Tracker */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm"
            >
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className="text-base font-bold text-slate-900">How are you feeling right now?</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Select a mood to update your live wellbeing score</p>
                </div>
                {isSavingMood && <span className="text-xs font-semibold text-indigo-600 animate-pulse">Recording...</span>}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {moodOptions.map((mood) => {
                  const isSelected = selectedMood === mood.value;
                  return (
                    <button
                      key={mood.value}
                      disabled={isSavingMood}
                      onClick={() => handleMoodSelect(mood.value)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all ${mood.bg} ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50/50 font-bold ring-2 ring-indigo-500/20' 
                          : 'border-slate-200/80 bg-slate-50/50'
                      }`}
                    >
                      <span className="text-2xl mb-1">{mood.emoji}</span>
                      <span className="text-xs font-medium">{mood.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <Link to="/ai-assistant" className="group">
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">24/7 AI</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1">AI Support Companion</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Confidential, non-judgmental guidance and stress techniques.</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                    <span>Start Chat</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              <Link to="/resources" className="group">
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">Articles</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1">Resource Library</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Self-help articles on academic pressure and burnout.</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-600">
                    <span>Read Guides</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              <Link to="/counselors" className="group">
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">Verified</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1">Campus Counselors</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Book confidential 1-on-1 sessions with licensed specialists.</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
                    <span>Book Session</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              <Link to="/community" className="group">
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">Anonymous</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1">Peer Support Forum</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Share experiences and encouragement safely with peers.</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-600">
                    <span>Join Forum</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

            </div>

          </div>

          {/* Sidebar Column (Right - 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Wellbeing Score Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
              <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-4">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span>Weekly Wellbeing Score</span>
              </div>

              <div className="relative inline-flex items-center justify-center mb-4">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle cx="72" cy="72" r="60" fill="transparent" stroke="#f1f5f9" strokeWidth="10" />
                  <circle 
                    cx="72" 
                    cy="72" 
                    r="60" 
                    fill="transparent" 
                    stroke="#4f46e5" 
                    strokeWidth="10" 
                    strokeDasharray="377" 
                    strokeDashoffset={377 - (377 * currentScore) / 100} 
                    className="transition-all duration-1000 ease-out" 
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-bold text-slate-900 tracking-tight">{currentScore}</span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">out of 100</span>
                </div>
              </div>

              <div className="inline-block bg-indigo-50 text-indigo-700 px-3.5 py-1 rounded-full text-xs font-bold mb-4">
                {scoreLabel}
              </div>

              {summary?.recommendations && summary.recommendations.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-600 text-left w-full border border-slate-100">
                  <span className="font-semibold text-slate-900 block mb-1">Recommended Action:</span>
                  <p className="leading-relaxed">{summary.recommendations[0]}</p>
                </div>
              )}
            </div>

            {/* Daily Checklist */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-sm mb-2">Recommended Daily Micro-Actions</h3>
              
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Practice 5-minute Pomodoro study break</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>Review article on managing exam pressure</span>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Log evening mood entry</span>
              </div>
            </div>

            {/* Helpline Box */}
            <div className="bg-rose-50 border border-rose-200/80 rounded-3xl p-5 text-rose-900 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-700 mb-0.5">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span>24/7 Tele-MANAS Hotline</span>
                </div>
                <p className="text-[11px] text-rose-600 font-medium">Free & confidential crisis support</p>
              </div>

              <a 
                href="tel:14416"
                className="px-3.5 py-2 bg-rose-600 text-white rounded-full text-xs font-bold hover:bg-rose-700 transition-colors flex items-center space-x-1 shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>14416</span>
              </a>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;

