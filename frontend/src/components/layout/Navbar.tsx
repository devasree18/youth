import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldAlert, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Sparkles, 
  BookOpen, 
  MessageSquare, 
  Activity, 
  Users, 
  Building2, 
  HeartHandshake,
  ChevronRight
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = user ? [
    { label: 'Dashboard', path: '/dashboard', icon: Activity },
    { label: 'Check-in', path: '/assessment', icon: Sparkles, badge: 'Daily' },
    { label: 'AI Companion', path: '/ai-assistant', icon: MessageSquare, badge: '24/7' },
    { label: 'Resources', path: '/resources', icon: BookOpen },
    { label: 'Counselors', path: '/counselors', icon: HeartHandshake },
    { label: 'Community', path: '/community', icon: Users },
    { label: 'Institution', path: '/institution', icon: Building2 },
  ] : [
    { label: 'How it works', path: '#how-it-works', icon: Sparkles },
    { label: 'Wellbeing Tools', path: '/resources', icon: BookOpen },
    { label: 'For Institutions', path: '/institution', icon: Building2 },
    { label: 'Counselors', path: '/counselors', icon: HeartHandshake },
    { label: 'Community', path: '/community', icon: Users },
  ];

  return (
    <header className="w-full bg-white/85 backdrop-blur-xl border-b border-slate-200/70 sticky top-0 z-40 transition-all duration-300 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo - Vibrant Gradient & Enterprise Styling */}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-center font-black text-xl shadow-md shadow-blue-500/25 group-hover:scale-105 group-hover:shadow-blue-500/40 transition-all duration-300">
              Y
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900 leading-none group-hover:text-blue-600 transition-colors">YOUTH</span>
              <span className="bg-blue-50 text-blue-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border border-blue-200/60 uppercase tracking-wide">PRO</span>
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block mt-0.5">Enterprise Wellbeing SaaS</span>
          </div>
        </Link>

        {/* Desktop Navigation Links - Centered Pill Design */}
        <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/60 p-1.5 rounded-2xl border border-slate-200/60">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return link.path.startsWith('#') ? (
              <a
                key={link.label}
                href={link.path}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-xs transition-all duration-200"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center space-x-1.5 ${
                  isActive 
                    ? 'bg-white text-blue-700 shadow-sm shadow-slate-200 border border-slate-200/80 font-extrabold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{link.label}</span>
                {link.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase ${
                    isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-200/70 text-slate-600'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & User Status */}
        <div className="hidden sm:flex items-center space-x-3">
          {/* Crisis 24/7 Pill */}
          <Link
            to="/crisis"
            className="flex items-center space-x-1.5 text-xs font-bold text-rose-600 bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200/80 px-3.5 py-2 rounded-xl transition-all duration-200 shadow-xs hover:shadow-sm hover:scale-[1.02]"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
            <span>24/7 Crisis</span>
          </Link>

          {user ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <Link 
                to="/dashboard"
                className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/80 transition-all duration-200 group"
              >
                <div className="relative">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 ring-2 ring-white rounded-full"></span>
                </div>
                <div className="text-left">
                  <span className="text-xs font-extrabold text-slate-900 block max-w-[90px] truncate leading-tight group-hover:text-blue-600 transition-colors">{user.name || 'User'}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block leading-none">{user.role || 'Member'}</span>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-4 py-2 text-slate-700 text-xs font-bold hover:text-blue-600 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/login"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-extrabold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md shadow-blue-500/20 flex items-center space-x-1.5 active:scale-[0.98]"
              >
                <User className="w-3.5 h-3.5" />
                <span>Get started</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-70" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex lg:hidden items-center space-x-2">
          <Link
            to="/crisis"
            className="p-2 text-rose-600 bg-rose-50 rounded-xl border border-rose-200"
            title="Crisis Support"
          >
            <ShieldAlert className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return link.path.startsWith('#') ? (
                <a
                  key={link.label}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <span>{link.label}</span>
                </a>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive ? 'bg-blue-50 text-blue-700 font-extrabold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-blue-100 text-blue-700 uppercase">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center rounded-xl border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-50"
                >
                  Sign in
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
