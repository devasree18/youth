import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
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
} from 'lucide-react';
import { Button } from '../ui/button';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = user
    ? [
        { label: 'Dashboard', path: '/dashboard', icon: Activity },
        { label: 'Check-in', path: '/assessment', icon: Sparkles },
        { label: 'AI Companion', path: '/ai-assistant', icon: MessageSquare },
        { label: 'Resources', path: '/resources', icon: BookOpen },
        { label: 'Counselors', path: '/counselors', icon: HeartHandshake },
        { label: 'Community', path: '/community', icon: Users },
        { label: 'Institution', path: '/institution', icon: Building2 },
      ]
    : [
        { label: 'Platform', path: '#features', icon: Sparkles },
        { label: 'Resources', path: '/resources', icon: BookOpen },
        { label: 'Counselors', path: '/counselors', icon: HeartHandshake },
        { label: 'Community', path: '/community', icon: Users },
        { label: 'For Institutions', path: '/institution', icon: Building2 },
      ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xs border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={user ? '/dashboard' : '/'} className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
            Y
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-base font-bold tracking-tight text-slate-900">YOUTH</span>
            <span className="text-[11px] font-medium text-slate-500">Enterprise</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return link.path.startsWith('#') ? (
              <a
                key={link.label}
                href={link.path}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors ${
                  isActive
                    ? 'bg-slate-100 text-blue-600 font-semibold'
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
        <div className="hidden sm:flex items-center space-x-2.5">
          {/* Crisis 24/7 Pill */}
          <Link
            to="/crisis"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 px-2.5 py-1.5 rounded-md transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>24/7 Crisis Helpline</span>
          </Link>

          {user ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left">
                  <span className="text-xs font-semibold text-slate-800 block max-w-[100px] truncate leading-tight">
                    {user.name || 'User'}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase leading-none">
                    {user.role || 'Member'}
                  </span>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="primary" size="sm">
                  Get started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex lg:hidden items-center space-x-2">
          <Link
            to="/crisis"
            className="p-1.5 text-rose-600 bg-rose-50 rounded-lg border border-rose-200"
            title="Crisis Support"
          >
            <ShieldAlert className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 animate-in fade-in">
          <div className="space-y-0.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return link.path.startsWith('#') ? (
                <a
                  key={link.label}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  <span>{link.label}</span>
                </a>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium ${
                    isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50"
                >
                  Sign in
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
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
