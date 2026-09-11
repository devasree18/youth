import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Heart,
  ClipboardList,
  BookOpen,
  MessageSquare,
  Library,
  Users,
  UserCheck,
  Calendar,
  Bell,
  Settings,
  ShieldAlert,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Building2,
  Lock,
  Search,
  CheckCircle2,
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

interface NavSection {
  title: string;
  items: {
    label: string;
    path: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  title = 'Dashboard',
  subtitle,
  actions,
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userRole = user?.role || 'student';

  const studentNavSections: NavSection[] = [
    {
      title: 'PLATFORM',
      items: [
        { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Wellbeing Check-in', path: '/assessment', icon: Heart, badge: 'Daily' },
        { label: 'Assessments', path: '/assessment#tests', icon: ClipboardList },
      ],
    },
    {
      title: 'CARE & COUNSELING',
      items: [
        { label: 'AI Companion', path: '/ai-assistant', icon: MessageSquare, badge: '24/7' },
        { label: 'Counselors', path: '/counselors', icon: UserCheck },
        { label: 'Appointments', path: '/counselors#appointments', icon: Calendar },
      ],
    },
    {
      title: 'RESOURCES & COMMUNITY',
      items: [
        { label: 'Resource Library', path: '/resources', icon: Library },
        { label: 'Solution Hub', path: '/solutions', icon: BookOpen },
        { label: 'Community', path: '/community', icon: Users },
        { label: 'Campus Portal', path: '/institution', icon: Building2 },
      ],
    },
  ];

  const counselorNavSections: NavSection[] = [
    {
      title: 'CLINICAL DASHBOARD',
      items: [
        { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Appointments', path: '/counselors#appointments', icon: Calendar, badge: 'Active' },
        { label: 'Client Directory', path: '/counselors', icon: Users },
      ],
    },
    {
      title: 'CLINICAL TOOLS',
      items: [
        { label: 'Resource Hub', path: '/resources', icon: Library },
        { label: 'Community', path: '/community', icon: Users },
        { label: 'Settings', path: '/dashboard#settings', icon: Settings },
      ],
    },
  ];

  const institutionNavSections: NavSection[] = [
    {
      title: 'CAMPUS ANALYTICS',
      items: [
        { label: 'Overview', path: '/institution', icon: Building2 },
        { label: 'Student Wellbeing', path: '/institution#analytics', icon: Heart },
        { label: 'Risk Intelligence', path: '/institution#risk', icon: ShieldAlert, badge: 'Live' },
      ],
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { label: 'Counselor Network', path: '/counselors', icon: UserCheck },
        { label: 'Resource Hub', path: '/resources', icon: Library },
        { label: 'Security & Audit', path: '/institution#audit', icon: Lock },
      ],
    },
  ];

  const navSections =
    userRole === 'institution' || userRole === 'admin'
      ? institutionNavSections
      : userRole === 'counselor'
      ? counselorNavSections
      : studentNavSections;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col antialiased">
      <div className="flex-1 flex w-full max-w-[1600px] mx-auto min-h-screen">
        {/* ==================== DESKTOP SIDEBAR ==================== */}
        <aside
          className={`hidden md:flex flex-col border-r border-slate-200 bg-white transition-all duration-200 shrink-0 sticky top-0 h-screen ${
            collapsed ? 'w-16' : 'w-60'
          }`}
        >
          {/* Brand header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
            <Link to="/dashboard" className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                Y
              </div>
              {!collapsed && (
                <div className="leading-tight">
                  <span className="text-sm font-bold tracking-tight text-slate-900 block">
                    YOUTH
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                    Enterprise SaaS
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation sections */}
          <div className="flex-1 py-4 px-2.5 overflow-y-auto space-y-6">
            {navSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                {!collapsed && (
                  <h4 className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    {section.title}
                  </h4>
                )}
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.path ||
                    (item.path.includes('#') && location.pathname + location.hash === item.path);

                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 overflow-hidden">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-blue-600' : 'text-slate-400'
                          }`}
                        />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!collapsed && item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${
                            isActive
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* User profile footer in sidebar */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <div
              className={`flex items-center justify-between ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                {!collapsed && (
                  <div className="overflow-hidden leading-tight">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide truncate">
                      {userRole}
                    </p>
                  </div>
                )}
              </div>

              {!collapsed && (
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* ==================== MAIN CONTENT & HEADER ==================== */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
          {/* Top Header */}
          <header className="h-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 bg-white flex items-center justify-between sticky top-0 z-30 shrink-0">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs text-slate-500 hidden sm:block leading-none mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Quick Search */}
              <div className="hidden lg:flex items-center relative w-52">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search workspace..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs text-slate-900 placeholder:text-slate-400 pl-8 pr-3 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                />
              </div>

              {/* 24/7 Crisis helpline pill */}
              <Link
                to="/crisis"
                className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1.5 rounded-md transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span>24/7 Crisis</span>
              </Link>

              {/* Notification Popover */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`p-2 rounded-md transition-colors relative ${
                    notificationsOpen
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-4 z-50 animate-in fade-in">
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
                          <p className="text-xs font-semibold text-slate-900">
                            Daily check-in ready
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Track your mood and wellbeing status for today.
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
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>

      {/* ==================== MOBILE MENU OVERLAY ==================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 bg-white h-full shadow-xl flex flex-col z-10 p-4 animate-in slide-in-from-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  Y
                </div>
                <span className="font-bold text-slate-900 text-sm">YOUTH</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 py-3 space-y-4 overflow-y-auto">
              {navSections.map((section, idx) => (
                <div key={idx} className="space-y-1">
                  <h4 className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    {section.title}
                  </h4>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.label}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon
                            className={`w-4 h-4 ${
                              isActive ? 'text-blue-600' : 'text-slate-400'
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md font-semibold bg-slate-100 text-slate-600">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100"
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
