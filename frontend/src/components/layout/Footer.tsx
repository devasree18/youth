import { Link } from 'react-router-dom';
import { ShieldCheck, PhoneCall } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 bg-white text-[#172033] antialiased">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Wellbeing Mission Statement */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                Y
              </div>
              <span className="text-base font-bold tracking-tight text-[#172033]">YOUTH</span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm font-normal">
              Proactive, confidential mental health and emotional care infrastructure designed for modern campus life and everyday student wellbeing.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/80">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pseudonymous & Privacy-Guarded</span>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Product
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li>
                <a href="/#how-it-works" className="hover:text-indigo-600 transition-colors">
                  How it works
                </a>
              </li>
              <li>
                <Link to="/resources" className="hover:text-indigo-600 transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="hover:text-indigo-600 transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* For organizations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              For organizations
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li>
                <Link to="/institution" className="hover:text-indigo-600 transition-colors">
                  Institutions
                </Link>
              </li>
              <li>
                <Link to="/counselors" className="hover:text-indigo-600 transition-colors">
                  Counselors
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Crisis Notice */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Legal
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600 mb-3">
              <li>
                <Link to="/crisis" className="hover:text-indigo-600 transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <a href="#terms" className="hover:text-indigo-600 transition-colors">
                  Terms
                </a>
              </li>
            </ul>
            <div className="p-3 bg-rose-50/80 rounded-xl border border-rose-200/80 space-y-1.5 text-xs text-rose-950">
              <div className="flex items-center space-x-1 font-bold text-rose-700">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Crisis support notice</span>
              </div>
              <p className="text-[11px] text-rose-900 leading-relaxed font-normal">
                YOUTH is not emergency medical care. In acute distress, access{' '}
                <Link to="/crisis" className="font-bold underline hover:text-rose-950">
                  urgent-help resources
                </Link>{' '}
                or call Tele-MANAS (14416) / KIRAN (1800-599-0019).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="border-t border-slate-100 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <p>© YOUTH {currentYear} | Built for everyday wellbeing</p>
          <div className="flex items-center space-x-4">
            <Link to="/crisis" className="text-rose-700 font-bold hover:underline">
              Urgent Help
            </Link>
            <Link to="/login" className="hover:text-indigo-600 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

