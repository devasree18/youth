import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { wellbeingService, type WellbeingSummary } from '../services/wellbeingService';
import { moodService } from '../services/moodService';
import { 
  MessageSquare, 
  BookOpen, 
  ChevronRight,
  ShieldAlert,
  LogOut,
  Activity,
  Users,
  Calendar
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [summary, setSummary] = useState<WellbeingSummary | null>(null);
  const [isSavingMood, setIsSavingMood] = useState(false);

  const moodOptions = [
    { label: 'Very Low', emoji: '😢', value: 'very_low', color: 'bg-red-50 text-red-600 border-red-200' },
    { label: 'Low', emoji: '😕', value: 'low', color: 'bg-orange-50 text-orange-600 border-orange-200' },
    { label: 'Okay', emoji: '😐', value: 'okay', color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
    { label: 'Good', emoji: '🙂', value: 'good', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { label: 'Great', emoji: '😄', value: 'great', color: 'bg-green-50 text-green-600 border-green-200' },
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

  const currentScore = summary?.wellbeingScore ?? 70;
  const scoreLabel = summary?.scoreLabel ?? 'Moderate';
  const dashOffset = 439.8 - (439.8 * currentScore) / 100;

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans relative overflow-hidden pb-32">
      {/* Subtle Dotted Background */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(#e5e7eb 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px'
      }}></div>

      {/* Top Floating Nav */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-6 flex justify-between items-center">
        <div className="bg-white rounded-full px-5 py-2.5 shadow-sm border border-slate-100 flex items-center space-x-3 text-sm font-bold text-slate-800">
          <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">
            {user?.name?.[0] || 'U'}
          </div>
          <span>{user?.name || 'Student'}</span>
        </div>
        <div className="flex space-x-3">
          <Link to="/crisis" className="bg-red-50 text-red-600 rounded-full px-5 py-2.5 shadow-sm border border-red-100 flex items-center space-x-2 text-sm font-bold hover:bg-red-100 transition-colors">
            <ShieldAlert className="w-4 h-4" />
            <span className="hidden sm:inline">Urgent Help</span>
          </Link>
          <button onClick={logout} className="bg-white rounded-full p-2.5 shadow-sm border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors">
            <LogOut className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-4 pt-16">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-[0.2em] text-slate-500 mb-6 uppercase">Dashboard Overview</h2>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">
            HELLO, <br />
            {user?.name?.split(' ')[0] || 'STUDENT'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Mood Check-in Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Activity className="w-32 h-32 text-slate-900" />
              </div>
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Daily Mood Check-in</h2>
                {isSavingMood && <span className="text-xs font-semibold text-primary-600 animate-pulse">Saving...</span>}
              </div>
              <div className="flex flex-wrap gap-3 relative z-10">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    disabled={isSavingMood}
                    onClick={() => handleMoodSelect(mood.value)}
                    className={`flex items-center px-4 py-3 rounded-full border transition-all hover:scale-105 active:scale-95 ${mood.color} ${selectedMood === mood.value ? 'ring-2 ring-offset-2 ring-current font-bold shadow-md' : 'opacity-80 bg-white'}`}
                  >
                    <span className="text-xl mr-2">{mood.emoji}</span>
                    <span className="text-sm">{mood.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Quick Links Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/ai-assistant">
                <motion.div whileHover={{ y: -4 }} className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 flex flex-col h-full group">
                  <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">AI Assistant</h3>
                  <p className="text-xs text-slate-500 mt-2 font-medium">Non-judgmental chat support available 24/7.</p>
                </motion.div>
              </Link>
              
              <Link to="/resources">
                <motion.div whileHover={{ y: -4 }} className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 flex flex-col h-full group">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 border border-slate-200 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5 text-slate-900" />
                  </div>
                  <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">Resource Hub</h3>
                  <p className="text-xs text-slate-500 mt-2 font-medium">Explore evidence-based wellness guides.</p>
                </motion.div>
              </Link>

              <Link to="/community">
                <motion.div whileHover={{ y: -4 }} className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 flex flex-col h-full group">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 border border-slate-200 group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5 text-slate-900" />
                  </div>
                  <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">Community</h3>
                  <p className="text-xs text-slate-500 mt-2 font-medium">Safe peer discussions & support.</p>
                </motion.div>
              </Link>

              <Link to="/counselors">
                <motion.div whileHover={{ y: -4 }} className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 flex flex-col h-full group">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 border border-slate-200 group-hover:scale-110 transition-transform">
                    <Calendar className="w-5 h-5 text-slate-900" />
                  </div>
                  <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">Counselors</h3>
                  <p className="text-xs text-slate-500 mt-2 font-medium">Book appointments with experts.</p>
                </motion.div>
              </Link>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Dynamic Well-being Score */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]"
            >
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8 relative z-10">Dynamic Well-being Score</h2>
              
              <div className="relative inline-flex items-center justify-center mb-6 z-10">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="70" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle cx="80" cy="80" r="70" fill="transparent" stroke="#ffffff" strokeWidth="12" strokeDasharray="439.8" strokeDashoffset={dashOffset} className="transition-all duration-1000 ease-out drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-5xl font-black">{currentScore}</span>
                </div>
              </div>
              <p className="text-center text-sm text-slate-300 font-medium relative z-10 px-4">
                Your calculated score is <span className="text-white font-bold">{scoreLabel}</span>.
              </p>
              {summary?.recommendations && summary.recommendations.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 text-center relative z-10">
                  💡 {summary.recommendations[0]}
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </main>

      {/* Bottom Floating Action */}
      <div className="fixed bottom-8 inset-x-0 z-50 pointer-events-none px-6 flex justify-center">
        <Link to="/assessment" className="pointer-events-auto bg-slate-900 text-white rounded-full pl-4 pr-6 py-3 shadow-2xl border border-slate-700 flex items-center space-x-3 hover:bg-slate-800 transition-transform hover:scale-105 active:scale-95">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold uppercase tracking-wider">Start Deep Check-in</span>
          <ChevronRight className="w-4 h-4 opacity-70" />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
