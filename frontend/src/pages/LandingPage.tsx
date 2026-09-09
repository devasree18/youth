import { motion } from 'framer-motion';
import { 
  Shield, 
  MessageSquare, 
  Activity, 
  BookOpen, 
  Building2, 
  Users, 
  ArrowRight,
  ShieldAlert,
  CheckSquare,
  Clock,
  Pin,
  PhoneCall
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';

const FEATURES = [
  {
    icon: Activity,
    title: 'Wellbeing Score Gauge',
    desc: 'Track your mood, stress levels, and emotional state with dynamic evidence-based calculations.',
    link: '/assessment',
    badge: 'Self-Guided'
  },
  {
    icon: MessageSquare,
    title: 'Safe AI Companion',
    desc: 'Empathetic 24/7 wellness companion with built-in safety filters and crisis interception.',
    link: '/ai-assistant',
    badge: '24/7 Support'
  },
  {
    icon: BookOpen,
    title: 'Curated Resource Hub',
    desc: 'Evidence-based guides, audio meditations, and articles designed for student life.',
    link: '/resources',
    badge: 'Evidence-Based'
  },
  {
    icon: Shield,
    title: 'Verified Counselors',
    desc: 'Connect with licensed campus mental health specialists for private 1-on-1 sessions.',
    link: '/counselors',
    badge: 'Confidential'
  },
  {
    icon: Users,
    title: 'Pseudonymous Community',
    desc: 'Share experiences and give encouragement safely without exposing your real identity.',
    link: '/community',
    badge: 'Anonymous'
  },
  {
    icon: Building2,
    title: 'Institution SaaS Portal',
    desc: 'Privacy-safe aggregated analytics and risk indicators for educational leaders.',
    link: '/institution',
    badge: 'Enterprise'
  }
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#f4f6f9] text-slate-900 font-sans py-4 sm:py-6 px-2 sm:px-4 lg:px-6">
      
      {/* Outer Application Frame - Matching reference benchmark image */}
      <div className="max-w-[1400px] mx-auto min-h-[94vh] bg-white rounded-[28px] sm:rounded-[36px] border border-slate-200/80 shadow-2xl shadow-slate-200/50 overflow-hidden relative flex flex-col">
        
        {/* Top Clean Navbar */}
        <Navbar />

        {/* Hero Section Container with Fine Dot-Grid Background Texture */}
        <main className="flex-1 relative bg-dot-pattern py-12 sm:py-16 md:py-24 px-4 sm:px-8 lg:px-12 flex flex-col justify-between overflow-hidden">
          
          {/* Central Hero Container */}
          <div className="relative z-10 max-w-4xl mx-auto text-center my-auto">
            
            {/* Top 3D Brand Emblem Badge - Benchmarked from reference image floating icon */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-blue-500/25 border border-white/20"
            >
              Y
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08] mb-6"
            >
              Your wellbeing, <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">supported every day.</span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-normal mb-8"
            >
              A private, thoughtful space to understand your wellbeing, build healthier routines, access trusted support, and grow at your own pace.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
            >
              <Link 
                to="/login"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <span>Start your wellbeing journey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link 
                to="/institution"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-bold shadow-sm transition-all hover:border-slate-300 flex items-center justify-center"
              >
                Explore for institutions
              </Link>
            </motion.div>
          </div>

          {/* FLOATING YOUTH INTERFACE CARDS (Benchmarked directly from Reference Image Composition) */}
          
          {/* FLOATING CARD 1: TOP-LEFT — Yellow Sticky Note Private Journal Prompt */}
          <motion.div
            initial={{ opacity: 0, x: -30, rotate: -4 }}
            animate={{ opacity: 1, x: 0, rotate: -4 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:block absolute top-12 left-10 w-64 bg-amber-100/90 border border-amber-200/80 rounded-2xl p-4 shadow-xl shadow-amber-900/5 backdrop-blur-sm z-20 hover:rotate-0 transition-transform"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center">
                <Pin className="w-3 h-3 mr-1 fill-amber-700 text-amber-700" />
                Private Reflection
              </span>
              <span className="text-[10px] text-amber-700 font-medium">Today</span>
            </div>
            <p className="text-xs font-semibold text-amber-950 leading-snug">
              "What is one small thing that brought you comfort or peace during your day?"
            </p>
            {/* Floating Mini Badge */}
            <div className="absolute -bottom-3 -right-3 bg-white p-2 rounded-xl border border-slate-200 shadow-md flex items-center space-x-1">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span className="text-[10px] font-bold text-slate-800">Saved Safely</span>
            </div>
          </motion.div>

          {/* FLOATING CARD 2: TOP-RIGHT — Reminders & Counselor Appointment Widget */}
          <motion.div
            initial={{ opacity: 0, x: 30, rotate: 3 }}
            animate={{ opacity: 1, x: 0, rotate: 3 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hidden lg:block absolute top-12 right-10 w-72 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xl shadow-slate-900/5 z-20 hover:rotate-0 transition-transform"
          >
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                Reminders
              </span>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Session</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-800">1-on-1 Counselor Consultation</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Dr. Ananya Sharma • Clinical Psychologist</p>
              <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-blue-700">
                <span>Today, 14:00 - 14:45</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Confirmed</span>
              </div>
            </div>
          </motion.div>

          {/* FLOATING CARD 3: BOTTOM-LEFT — Today's Wellbeing Progress */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="hidden lg:block absolute bottom-12 left-12 w-72 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xl shadow-slate-900/5 z-20 hover:rotate-0 transition-transform"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">Today's Check-in</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">82 / 100</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div>
                <div className="flex justify-between text-slate-600 font-semibold mb-1">
                  <span>Mindfulness & Rest</span>
                  <span>80%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-[80%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-slate-600 font-semibold mb-1">
                  <span>Emotional Clarity</span>
                  <span>85%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full w-[85%]" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* FLOATING CARD 4: BOTTOM-RIGHT — 24/7 Crisis Hotline Pill + AI Support Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: 2 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="hidden lg:block absolute bottom-12 right-12 w-64 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xl shadow-slate-900/5 z-20 hover:rotate-0 transition-transform"
          >
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900">24/7 Crisis Hotline</span>
            </div>
            <p className="text-[11px] text-slate-600 mb-2">Tele-MANAS National Mental Health Line</p>
            <div className="bg-red-50 border border-red-200/80 rounded-xl p-2 flex items-center justify-between text-xs font-bold text-red-700">
              <span className="flex items-center">
                <PhoneCall className="w-3 h-3 mr-1 text-red-600" />
                14416
              </span>
              <span className="text-[9px] uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded-md">Toll-Free</span>
            </div>
          </motion.div>

          {/* Features Grid Section */}
          <section id="how-it-works" className="relative z-10 max-w-6xl mx-auto mt-20 pt-12 border-t border-slate-100">
            <div className="text-center mb-12">
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Core SaaS Modules
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                Everything required for holistic wellbeing
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <f.icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {f.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-1.5">{f.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">{f.desc}</p>
                  </div>

                  <Link 
                    to={f.link} 
                    className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Enterprise Institution Section Banner */}
          <section className="relative z-10 max-w-6xl mx-auto mt-16 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold">
                <Building2 className="w-3.5 h-3.5" />
                <span>Enterprise Institution Portal</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Empower your campus with aggregated wellbeing intelligence.
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Protect student privacy while gaining institutional visibility into mental health trends, stress indicators, and support utilization across departments.
              </p>
            </div>

            <Link
              to="/institution"
              className="shrink-0 px-6 py-3.5 rounded-2xl bg-white text-slate-900 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-all shadow-lg active:scale-[0.98]"
            >
              Request Institution Demo
            </Link>
          </section>

        </main>

        {/* Clean Footer */}
        <footer className="border-t border-slate-100 bg-white px-6 py-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">Y</div>
            <span className="font-bold text-slate-900">YOUTH Enterprise Wellbeing SaaS</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] font-semibold text-slate-600">
            <Link to="/crisis" className="text-red-600 hover:underline font-bold">Tele-MANAS (14416)</Link>
            <Link to="/resources" className="hover:text-slate-900">Resources</Link>
            <Link to="/counselors" className="hover:text-slate-900">Counselors</Link>
            <Link to="/institution" className="hover:text-slate-900">For Institutions</Link>
          </div>
          <p className="text-[11px] text-slate-400">© {new Date().getFullYear()} YOUTH. Confidential & Safe.</p>
        </footer>

      </div>
    </div>
  );
};

export default LandingPage;

