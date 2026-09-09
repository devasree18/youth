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
  HeartHandshake 
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
    { label: 'Check-in', path: '/assessment', icon: Sparkles },
    { label: 'AI Companion', path: '/ai-assistant', icon: MessageSquare },
    { label: 'Resources', path: '/resources', icon: BookOpen },
    { label: 'Counselors', path: '/counselors', icon: HeartHandshake },
    { label: 'Community', path: '/community', icon: Users },
    { label: 'Institution', path: '/institution', icon: Building2 },
  ] : [
    { label: 'How it works', path: '#how-it-works', icon: Sparkles },
    { label: 'Wellbeing tools', path: '/resources', icon: BookOpen },
    { label: 'For institutions', path: '/institution', icon: Building2 },
    { label: 'Counselors', path: '/counselors', icon: HeartHandshake },
    { label: 'Community', path: '/community', icon: Users },
  ];

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo - 3D Icon styling inspired by reference image benchmark */}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            Y
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-900 block leading-none">YOUTH</span>
            <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 block mt-0.5">Enterprise Wellbeing SaaS</span>
          </div>
        </Link>

        {/* Desktop Navigation Links - Centered */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return link.path.startsWith('#') ? (
              <a
                key={link.label}
                href={link.path}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 font-bold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & User Status */}
        <div className="hidden sm:flex items-center space-x-3">
          <Link
            to="/crisis"
            className="flex items-center space-x-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/80 px-3.5 py-2 rounded-xl transition-colors shadow-sm"
          >
            <ShieldAlert className="w-4 h-4 text-red-600 animate-pulse" />
            <span>24/7 Crisis</span>
          </Link>

          {user ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate">{user.name || 'User'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-4 py-2 text-slate-600 text-xs font-semibold hover:text-slate-900 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/login"
                className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 flex items-center space-x-1.5 active:scale-[0.98]"
              >
                <User className="w-3.5 h-3.5" />
                <span>Get started</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex lg:hidden items-center space-x-2">
          <Link
            to="/crisis"
            className="p-2 text-red-600 bg-red-50 rounded-xl border border-red-200"
            title="Crisis Support"
          >
            <ShieldAlert className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return link.path.startsWith('#') ? (
              <a
                key={link.label}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <span>{link.label}</span>
              </a>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
              >
                <Icon className="w-5 h-5 text-slate-400" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center rounded-xl border border-slate-200 text-slate-800 text-xs font-bold"
                >
                  Sign in
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20"
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

