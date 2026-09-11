import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useMobileApp } from '../../../components/mobile/MobileAppProvider';
import {
  LogOut,
  Menu,
  X,
  PhoneCall,
  LayoutDashboard,
  Mail,
  Copy,
  Check,
} from 'lucide-react';

export const CinematicNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { registerBackHandler } = useMobileApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (mobileMenuOpen) {
      return registerBackHandler(
        'navbarMenu',
        () => {
          setMobileMenuOpen(false);
          return true;
        },
        30
      );
    }
  }, [mobileMenuOpen, registerBackHandler]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard?.writeText('support@youth.edu');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNavClick = (e: React.MouseEvent, path: string, isAnchor?: boolean) => {
    if (isAnchor) {
      e.preventDefault();
      const targetId = path.replace('#', '').replace('/', '');
      if (location.pathname === '/') {
        if (targetId === 'overview' || !targetId) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      } else {
        navigate(`/#${targetId}`);
      }
      if (mobileMenuOpen) setMobileMenuOpen(false);
    } else {
      if (mobileMenuOpen) setMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    if (location.hash && location.pathname === '/') {
      const targetId = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        if (targetId === 'overview') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.hash, location.pathname]);

  const navLinks = [
    { label: 'Overview', path: '#overview', isAnchor: true },
    { label: 'Features', path: '#features', isAnchor: true },
    { label: 'Sanctuary', path: '/assessment' },
    { label: 'AI Support', path: '/ai-assistant' },
    { label: 'Community', path: '/community' },
    { label: 'Crisis', path: '/crisis' },
  ];

  return (
    <>
      {/* ============================================================ */}
      {/* FLOATING 3-ISLAND SEGMENTED PILL NAVBAR (Like Reference 2)   */}
      {/* ============================================================ */}
      <header className="fixed top-4 sm:top-5 left-0 right-0 z-50 pointer-events-none select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          
          {/* ============================================================ */}
          {/* ISLAND 1 (LEFT): LIVE STATUS / AVAILABILITY PILL            */}
          {/* ============================================================ */}
          <div className="pointer-events-auto">
            <Link
              to={user ? "/assessment" : "/login"}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_4px_14px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.1)] transition-all group"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#00C853] animate-pulse shrink-0" />
              <span className="text-xs font-semibold text-[#1F2937] tracking-tight whitespace-nowrap">
                available for campus
              </span>
            </Link>
          </div>

          {/* ============================================================ */}
          {/* ISLAND 2 (CENTER): BRAND LOGO + NAVIGATION LINKS PILL       */}
          {/* ============================================================ */}
          <div className="pointer-events-auto hidden md:flex items-center bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-full py-1.5 px-2 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            {/* Circular Dark Logo Badge */}
            <Link
              to={user ? '/dashboard' : '/'}
              onClick={(e) => {
                if (!user && location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#111827] text-white hover:bg-black transition-colors shrink-0 mr-3 shadow-xs"
              aria-label="YOUTH Home"
            >
              <span className="text-sm font-black tracking-tight font-mono">Y</span>
            </Link>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-1 sm:space-x-2 pr-2">
              {navLinks.map((link) => {
                if (link.isAnchor) {
                  return (
                    <a
                      key={link.label}
                      href={link.path}
                      onClick={(e) => handleNavClick(e, link.path, true)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#374151] hover:text-[#111827] hover:bg-slate-100/80 transition-all duration-150 cursor-pointer"
                    >
                      {link.label}
                    </a>
                  );
                }
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-[#111827] text-white font-bold'
                        : 'text-[#374151] hover:text-[#111827] hover:bg-slate-100/80'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* ============================================================ */}
          {/* ISLAND 3 (RIGHT): CONTACT / EMAIL / ACTION PILL             */}
          {/* ============================================================ */}
          <div className="pointer-events-auto flex items-center space-x-2">
            {user ? (
              <div className="flex items-center space-x-2 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-full px-3 py-1.5 shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1.5 text-xs font-bold text-[#111827] hover:text-[#00C853] transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
                <span className="text-slate-300">·</span>
                <button
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {/* Email / Support Pill (Exact reference 2 pattern) */}
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="hidden sm:inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_4px_14px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.1)] text-xs font-semibold text-[#1F2937] hover:bg-slate-50 transition-all cursor-pointer group"
                  title="Click to copy support email"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-700 group-hover:text-black" />
                  )}
                  <span>{copied ? 'Copied to clipboard' : 'hey@youth.edu'}</span>
                </button>

                {/* Login / Action Pill */}
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_4px_14px_rgba(0,0,0,0.06)] text-xs font-bold text-[#111827] hover:bg-slate-50 transition-all"
                >
                  Sign in
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_4px_14px_rgba(0,0,0,0.06)] text-[#111827] cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>
      </header>

      {/* Spacer for fixed navbar */}
      <div className="h-16 sm:h-20" />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-end pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 p-6 pt-[max(1.5rem,env(safe-area-inset-top,0px))] pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-sm font-mono">
                    Y
                  </div>
                  <span className="font-bold text-[#111827] text-base">YOUTH</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 py-6 space-y-1.5 overflow-y-auto">
                {navLinks.map((link) => (
                  link.isAnchor ? (
                    <a
                      key={link.label}
                      href={link.path}
                      onClick={(e) => handleNavClick(e, link.path, true)}
                      className="flex items-center px-4 py-3 rounded-2xl text-sm font-semibold text-[#111827] hover:bg-slate-50 transition-colors min-h-[44px] cursor-pointer"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#111827] hover:bg-slate-50 transition-colors min-h-[44px]"
                    >
                      <span>{link.label}</span>
                    </Link>
                  )
                ))}

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to="/crisis"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2.5 px-4 py-3 rounded-2xl text-sm font-bold text-rose-700 hover:bg-rose-50 transition-colors min-h-[44px]"
                  >
                    <PhoneCall className="w-4 h-4 text-rose-600" />
                    <span>24/7 Crisis Support</span>
                  </Link>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center py-3 rounded-full bg-[#00C853] text-white font-bold text-sm shadow-xs min-h-[44px]"
                >
                  Start check-in
                </Link>
                <div className="flex items-center justify-center text-xs text-slate-500 gap-1.5 pt-2">
                  <Mail className="w-3.5 h-3.5" />
                  <span>support@youth.edu</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CinematicNavbar;

