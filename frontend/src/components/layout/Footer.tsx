import { Link } from 'react-router-dom';
import { ShieldCheck, PhoneCall } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 bg-white text-[#111827] antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          
          {/* Left: Brand, Copyright & Privacy Badge */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-xs font-mono">
                Y
              </div>
              <span className="font-black text-sm tracking-tight text-[#111827]">YOUTH</span>
            </Link>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500 font-medium">
              © {currentYear} Student Sanctuary
            </span>
            <span className="text-slate-300 hidden sm:inline">·</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              100% Private
            </span>
          </div>

          {/* Center: Clean Minimal Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs font-medium text-[#4B5563]">
            <a href="#overview" className="hover:text-[#00C853] transition-colors">
              Overview
            </a>
            <a href="#features" className="hover:text-[#00C853] transition-colors">
              Features
            </a>
            <Link to="/assessment" className="hover:text-[#00C853] transition-colors">
              Sanctuary
            </Link>
            <Link to="/community" className="hover:text-[#00C853] transition-colors">
              Peer Circles
            </Link>
            <Link to="/resources" className="hover:text-[#00C853] transition-colors">
              Resources
            </Link>
          </nav>

          {/* Right: Crisis Hotline Action & Sign In */}
          <div className="flex items-center space-x-3 text-xs">
            <Link
              to="/crisis"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold transition-colors border border-rose-200/80"
              title="24/7 National Crisis Helpline"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Crisis (14416)</span>
            </Link>
            <span className="text-slate-300">·</span>
            <Link
              to="/login"
              className="font-bold text-[#111827] hover:text-[#00C853] transition-colors"
            >
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;



