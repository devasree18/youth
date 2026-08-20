import { motion } from 'framer-motion';
import { Shield, MessageSquare, Activity, BookOpen, Bookmark, Mail, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans relative overflow-hidden">
      {/* Subtle Dotted Background */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(#e5e7eb 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px'
      }}></div>

      {/* Top Floating Elements */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-6 flex justify-between items-center">
        <div className="bg-white rounded-full px-5 py-2.5 shadow-sm border border-slate-100 flex items-center space-x-2 text-sm font-semibold text-slate-800">
          <Mail className="w-4 h-4 text-slate-600" />
          <span>support@youthmentalhealth.app</span>
        </div>
        <Link to="/login" className="bg-white rounded-full p-2.5 shadow-sm border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors">
          <span className="font-bold text-lg px-2">*</span>
        </Link>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-4 pt-12 pb-32 flex flex-col items-center">
        {/* Headline Section */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-[0.2em] text-slate-500 mb-6 uppercase">Key Features Of</h2>
          <h1 className="text-6xl md:text-[5.5rem] leading-[0.9] font-black text-slate-900 tracking-tighter uppercase mx-auto max-w-4xl">
            Youth Mental <br /> Health Access
          </h1>
        </div>

        {/* Central Graphic & Floating Cards Area */}
        <div className="relative w-full max-w-3xl aspect-[4/3] mt-8">
          
          {/* Background Shape behind Image */}
          <div className="absolute inset-x-8 inset-y-12 bg-[#FEEBC8] rounded-[3rem] -z-10 shadow-inner opacity-70"></div>

          {/* Central Image */}
          <div className="absolute inset-0 flex items-center justify-center -z-0">
             <img src="/hero.jpg" alt="Supportive abstract figure" className="h-[110%] w-auto object-contain object-bottom drop-shadow-2xl" style={{ mixBlendMode: 'multiply' }} />
          </div>

          {/* Top Center Floating Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-4 py-2 shadow-lg border border-slate-100 flex items-center space-x-3"
          >
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-xl">🙂</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-900 leading-tight">Student-Focused</p>
              <p className="text-[10px] text-slate-500 font-medium">Safe and anonymous</p>
            </div>
          </motion.div>

          {/* Floating Card 1: Left Top */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-1/4 -left-12 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 w-56 flex items-start space-x-3"
          >
            <div className="p-2 bg-slate-50 rounded-lg">
              <Activity className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Well-being Check</h3>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">Track your mood and stress levels over time...</p>
            </div>
          </motion.div>

          {/* Floating Card 2: Right Top */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-1/3 -right-8 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 w-56 flex items-start space-x-3"
          >
            <div className="p-2 bg-slate-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">AI Support Assistant</h3>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">Non-judgmental guidance available 24/7...</p>
            </div>
          </motion.div>

          {/* Floating Card 3: Left Bottom */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-1/4 -left-8 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 w-56 flex items-start space-x-3"
          >
            <div className="p-2 bg-slate-50 rounded-lg">
              <BookOpen className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Resource Hub</h3>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">Articles tailored for college academic pressure...</p>
            </div>
          </motion.div>

          {/* Floating Card 4: Right Bottom */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-12 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 w-56 flex items-start space-x-3"
          >
            <div className="p-2 bg-slate-50 rounded-lg">
              <Shield className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Professional Help</h3>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">Connect with verified counselors quickly...</p>
            </div>
          </motion.div>

        </div>

      </main>

      {/* Bottom Floating Elements */}
      <div className="fixed bottom-6 inset-x-0 z-50 pointer-events-none px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <Link to="/assessment" className="pointer-events-auto bg-white rounded-full pl-2 pr-5 py-2 shadow-lg border border-slate-100 flex items-center space-x-3 hover:bg-slate-50 transition-transform hover:scale-105 active:scale-95">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white">
              <PhoneCall className="w-4 h-4 text-slate-700" />
            </div>
            <span className="text-sm font-bold text-slate-900">Start your Check-in</span>
          </Link>

          <Link to="/resources" className="pointer-events-auto bg-white rounded-full px-5 py-3 shadow-lg border border-slate-100 flex items-center space-x-2 hover:bg-slate-50 transition-transform hover:scale-105 active:scale-95">
            <span className="text-sm font-bold text-slate-900">Explore Resources</span>
            <Bookmark className="w-4 h-4 text-slate-900 fill-current" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
