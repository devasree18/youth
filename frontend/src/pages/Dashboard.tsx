import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  BookOpen, 
  Stethoscope, 
  ChevronRight,
  ShieldAlert,
  LogOut,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moodOptions = [
    { label: 'Very Low', emoji: '😢', value: 'very_low', color: 'bg-red-50 text-red-600 border-red-200' },
    { label: 'Low', emoji: '😕', value: 'low', color: 'bg-orange-50 text-orange-600 border-orange-200' },
    { label: 'Okay', emoji: '😐', value: 'okay', color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
    { label: 'Good', emoji: '🙂', value: 'good', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { label: 'Great', emoji: '😄', value: 'great', color: 'bg-green-50 text-green-600 border-green-200' },
  ];

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
              <h2 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight relative z-10">Daily Check-in</h2>
              <div className="flex flex-wrap gap-3 relative z-10">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`flex items-center px-4 py-3 rounded-full border transition-all hover:scale-105 active:scale-95 ${mood.color} ${selectedMood === mood.value ? 'ring-2 ring-offset-2 ring-current font-bold shadow-md' : 'opacity-80 bg-white'}`}
                  >
                    <span className="text-xl mr-2">{mood.emoji}</span>
                    <span className="text-sm">{mood.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
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
                  <p className="text-xs text-slate-500 mt-2 font-medium">Explore articles tailored for college stress.</p>
                </motion.div>
              </Link>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Well-being Score */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]"
            >
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8 relative z-10">Well-being Score</h2>
              
              <div className="relative inline-flex items-center justify-center mb-6 z-10">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="70" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle cx="80" cy="80" r="70" fill="transparent" stroke="#ffffff" strokeWidth="12" strokeDasharray="439.8" strokeDashoffset={439.8 - (439.8 * 72) / 100} className="transition-all duration-1000 ease-out drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-5xl font-black">72</span>
                </div>
              </div>
              <p className="text-center text-sm text-slate-300 font-medium relative z-10 px-4">Your score is <span className="text-white font-bold">Moderate</span>. You've been doing well recently.</p>
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
