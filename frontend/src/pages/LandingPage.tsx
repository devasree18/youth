import { motion } from 'framer-motion';
import { 
  Shield, 
  MessageSquare, 
  Activity, 
  BookOpen, 
  PhoneCall, 
  User, 
  LogIn, 
  Sparkles, 
  HeartHandshake, 
  Building2, 
  Users, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: Activity,
    title: 'Well-being Check',
    desc: 'Track your mood, stress levels, and sleep quality over time with automated score calculations.',
    link: '/assessment',
    badge: 'Self-Guided'
  },
  {
    icon: MessageSquare,
    title: 'AI Support Assistant',
    desc: 'Non-judgmental wellness companion available 24/7 with instant crisis interception.',
    link: '/ai',
    badge: '24/7 Support'
  },
  {
    icon: BookOpen,
    title: 'Resource Hub',
    desc: 'Evidence-based articles and guides tailored specifically for student academic pressure.',
    link: '/resources',
    badge: 'Curated'
  },
  {
    icon: Shield,
    title: 'Verified Counselors',
    desc: 'Connect with licensed mental health specialists for online or in-person sessions.',
    link: '/counselors',
    badge: 'Confidential'
  },
  {
    icon: Users,
    title: 'Peer Community',
    desc: 'Share experiences and find encouragement safely under pseudonymous handles.',
    link: '/community',
    badge: 'Anonymous'
  },
  {
    icon: Building2,
    title: 'Campus SaaS Portal',
    desc: 'Aggregate, privacy-suppressed wellbeing analytics for educational institutions.',
    link: '/institution',
    badge: 'Enterprise'
  }
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans relative overflow-x-hidden flex flex-col">
      {/* Subtle Dotted Background Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-60" 
        style={{
          backgroundImage: 'radial-gradient(#d1d5db 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Navigation Header */}
      <header className="relative z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              Y
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 block leading-none">YOUTH</span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-600 block mt-0.5">Wellbeing SaaS Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <Link to="/resources" className="hover:text-slate-900 transition-colors">Resources</Link>
            <Link to="/counselors" className="hover:text-slate-900 transition-colors">Counselors</Link>
            <Link to="/institution" className="hover:text-slate-900 transition-colors">Institution SaaS</Link>
            <Link to="/crisis" className="text-red-600 hover:text-red-700 font-bold flex items-center">
              <ShieldAlert className="w-4 h-4 mr-1" />
              Crisis 24/7
            </Link>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center space-x-3">
            <Link 
              to="/login" 
              className="px-5 py-2.5 rounded-full border border-slate-200 bg-white text-slate-800 text-xs sm:text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm flex items-center"
            >
              <LogIn className="w-4 h-4 mr-1.5 text-slate-600" />
              Log In
            </Link>
            <Link 
              to="/login" 
              className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs sm:text-sm font-bold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center"
            >
              <User className="w-4 h-4 mr-1.5" />
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex flex-col items-center">
        
        {/* Top Announcement Pill */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-8 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-indigo-900">Student & Enterprise Mental Health Access</span>
        </motion.div>

        {/* Hero Display Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight uppercase leading-[1.05] mb-6">
            Youth Mental <br className="hidden sm:inline" />
            <span className="text-indigo-600">Health Access</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
            A secure, confidential, and evidence-based SaaS platform empowering students, educational institutions, and counselors with personalized wellbeing support.
          </p>
        </div>

        {/* Hero Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full max-w-md mx-auto">
          <Link 
            to="/assessment" 
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 flex items-center justify-center"
          >
            <PhoneCall className="w-4 h-4 mr-2" />
            Start Free Check-in
          </Link>
          <Link 
            to="/ai" 
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border-2 border-slate-200 text-slate-800 font-bold text-sm hover:border-slate-400 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center"
          >
            <MessageSquare className="w-4 h-4 mr-2 text-indigo-600" />
            Try AI Companion
          </Link>
        </div>

        {/* Hero Interactive Showcase Card */}
        <div className="w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 mb-20 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
                <HeartHandshake className="w-4 h-4 text-emerald-600" />
                <span>100% Student-Focused & Anonymous</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                Proactive Mental Health Support at Your Fingertips
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Whether you need daily mood tracking, immediate AI assistance, structured assessment tools, or a private session with a campus counselor, YOUTH provides an integrated safe space.
              </p>
              
              <div className="pt-2 flex items-center space-x-4">
                <Link 
                  to="/crisis" 
                  className="inline-flex items-center text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-2.5 rounded-full transition-colors"
                >
                  <ShieldAlert className="w-4 h-4 mr-1.5" />
                  Emergency Hotlines (24/7)
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center items-center">
              <div className="w-full aspect-square max-w-xs bg-gradient-to-tr from-amber-100 via-orange-100 to-indigo-100 rounded-3xl p-6 flex flex-col justify-between shadow-inner border border-orange-200/50">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    🙂
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Dynamic Wellbeing Index</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Updated real-time from check-ins</p>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-600">Weekly Score</span>
                    <span className="text-indigo-600 font-black">78 / 100</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full w-[78%]" />
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-sm border border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Counselor Booking</span>
                  <span className="text-emerald-600">Available Today</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Feature Cards Grid Section */}
        <section id="features" className="w-full max-w-6xl mx-auto py-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase mb-3">Core Modules</h2>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">
              Everything You Need For Campus Wellbeing
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <f.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {f.badge}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">{f.desc}</p>
                </div>

                <Link 
                  to={f.link} 
                  className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700"
                >
                  <span>Explore Feature</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer Section */}
      <footer className="bg-white border-t border-slate-200 mt-20 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">
              Y
            </div>
            <span className="text-sm font-bold text-slate-800">YOUTH Mental Health SaaS Platform</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-500">
            <Link to="/crisis" className="text-red-600 hover:underline">Tele-MANAS Hotline (14416)</Link>
            <Link to="/resources" className="hover:text-slate-800">Resources</Link>
            <Link to="/counselors" className="hover:text-slate-800">Counselors</Link>
            <Link to="/institution" className="hover:text-slate-800">Institution Portal</Link>
            <Link to="/login" className="hover:text-slate-800">Account Login</Link>
          </div>

          <p className="text-xs text-slate-400 text-center">
            © {new Date().getFullYear()} YOUTH Platform. Confidential & Secure.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
