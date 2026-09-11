import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Sparkles,
  MessageSquare,
  BookOpen,
  Users,
  UserCheck,
  Calendar,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Building2,
  Lock,
  MoreHorizontal,
  CheckCircle2,
  PhoneCall,
  Wind,
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  title = 'Home',
  subtitle,
  actions,
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userRole = user?.role || 'student';
  const isStudent = userRole === 'student';

  // Core simplified navigation for students
  const studentMainLinks = [
    { label: 'Home', path: '/dashboard', icon: Home },
    { label: 'Check-in', path: '/assessment', icon: Sparkles },
    { label: 'AI Support', path: '/ai-assistant', icon: MessageSquare },
    { label: 'Resources', path: '/resources', icon: BookOpen },
  ];

  const studentMoreLinks = [
    { label: 'Self-Care Tools', path: '/solutions', icon: Wind },
    { label: 'Counselor Directory', path: '/counselors', icon: UserCheck },
    { label: 'Peer Community', path: '/community', icon: Users },
  ];

  // Staff / Institution links (only shown if user is staff/institution)
  const staffLinks = [
    { label: 'Overview', path: '/institution', icon: Building2 },
    { label: 'Counselor Network', path: '/counselors', icon: UserCheck },
    { label: 'Resources', path: '/resources', icon: BookOpen },
    { label: 'Security & Audit', path: '/institution#audit', icon: Lock },
  ];

  const counselorLinks = [
    { label: 'Overview', path: '/dashboard', icon: Home },
    { label: 'Appointments', path: '/counselors#appointments', icon: Calendar },
    { label: 'Directory', path: '/counselors', icon: UserCheck },
    { label: 'Resources', path: '/resources', icon: BookOpen },
    { label: 'Community', path: '/community', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#fcfdfd] text-slate-800 flex flex-col antialiased">
      <div className="flex-1 flex w-full max-w-[1440px] mx-auto min-h-screen">
        {/* ==================== DESKTOP SIDEBAR ==================== */}
        <aside
          className={`hidden md:flex flex-col border-r border-slate-100 bg-white transition-all duration-200 shrink-0 sticky top-0 h-screen ${
            collapsed ? 'w-16' : 'w-56'
          }`}
        >
          {/* Logo Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
            <Link to="/dashboard" className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                Y
              </div>
              {!collapsed && (
                <span className="text-base font-bold tracking-tight text-slate-900">
                  YOUTH
                </span>
              )}
            </Link>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 py-4 px-2.5 overflow-y-auto space-y-1">
            {isStudent ? (
              <>
                {studentMainLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}

                <div className="pt-4 mt-4 border-t border-slate-100">
                  {!collapsed && (
                    <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      More
                    </span>
                  )}
                  {studentMoreLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.label}
                        to={item.path}
                        title={collapsed ? item.label : undefined}
                        className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        {!collapsed && <span>{item.label}</span>}
                      </Link>
                    );
                  })}
                </div>
              </>
            ) : userRole === 'counselor' ? (
              counselorLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-medium ${
                      isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })
            ) : (
              staffLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-medium ${
                      isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })
            )}
          </div>

          {/* User profile footer */}
          <div className="p-3 border-t border-slate-100 bg-white">
            <div className={`flex items-center justify-between ${collapsed ? 'justify-center' : ''}`}>
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                {!collapsed && (
                  <div className="overflow-hidden leading-tight">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {user?.name?.split(' ')[0] || 'User'}
                    </p>
                    <p className="text-[10px] text-slate-400 capitalize truncate">
                      {userRole}
                    </p>
                  </div>
                )}
              </div>

              {!collapsed && (
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* ==================== MAIN CONTENT & HEADER ==================== */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#fcfdfd]">
          {/* Top Header */}
          <header className="h-16 px-4 sm:px-8 border-b border-slate-100 bg-white/80 backdrop-blur-xs flex items-center justify-between sticky top-0 z-30 shrink-0">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight leading-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs text-slate-400 hidden sm:block leading-none mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quiet, accessible urgent help link */}
              <Link
                to="/crisis"
                className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-rose-50/50 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-slate-400 hover:text-rose-500" />
                <span>Urgent Help</span>
              </Link>

              {/* Notification icon */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200/80 p-4 z-50 animate-in fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h4 className="text-xs font-semibold text-slate-900">Notifications</h4>
                      <button
                        onClick={() => setNotificationsOpen(false)}
                        className="text-[10px] text-blue-600 font-medium hover:underline"
                      >
                        Dismiss
                      </button>
                    </div>
                    <div className="mt-2.5 space-y-2">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-slate-900">
                            Daily check-in ready
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Take a moment to record how you are feeling today.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {actions && <div>{actions}</div>}
            </div>
          </header>

          {/* Main content viewport */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto pb-20 md:pb-8">
            {children}
          </main>
        </div>
      </div>

      {/* ==================== MOBILE BOTTOM NAVIGATION ==================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-sm border-t border-slate-200 flex items-center justify-around px-2 z-40">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition-colors ${
            location.pathname === '/dashboard' ? 'text-blue-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </Link>
        <Link
          to="/assessment"
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition-colors ${
            location.pathname === '/assessment' ? 'text-blue-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span>Check-in</span>
        </Link>
        <Link
          to="/ai-assistant"
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition-colors ${
            location.pathname === '/ai-assistant' ? 'text-blue-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span>Support</span>
        </Link>
        <Link
          to="/resources"
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition-colors ${
            location.pathname === '/resources' ? 'text-blue-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span>Guides</span>
        </Link>
        <button
          onClick={() => setMoreMenuOpen(true)}
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium text-slate-500`}
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span>More</span>
        </button>
      </nav>

      {/* ==================== MOBILE "MORE" DRAWER ==================== */}
      {(mobileMenuOpen || moreMenuOpen) && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs"
            onClick={() => {
              setMobileMenuOpen(false);
              setMoreMenuOpen(false);
            }}
          />
          <div className="relative w-64 bg-white h-full shadow-xl flex flex-col z-10 p-5 animate-in slide-in-from-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-slate-900 text-sm">Menu</span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setMoreMenuOpen(false);
                }}
                className="p-1 rounded-md text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 py-4 space-y-1 overflow-y-auto">
              {studentMainLinks.concat(studentMoreLinks).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMoreMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium ${
                      isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-slate-100">
                <Link
                  to="/crisis"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setMoreMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium text-rose-700 hover:bg-rose-50"
                >
                  <PhoneCall className="w-4 h-4 text-rose-600" />
                  <span>24/7 Urgent Help</span>
                </Link>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

