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
  Flame
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

interface NavSection {
  title: string;
  items: {
    label: string;
    path: string;
    icon: React.ElementType;
    badge?: string;
    badgeColor?: string;
  }[];
}

export const AppShell: React.FC<AppShellProps> = ({ children, title = "Dashboard", subtitle }) => {
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

  // Categorized Nav Sections for Students
  const studentNavSections: NavSection[] = [
    {
      title: 'CORE PLATFORM',
      items: [
        { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Wellbeing Check-in', path: '/assessment', icon: Heart, badge: 'Daily', badgeColor: 'bg-emerald-50 text-emerald-700' },
        { label: 'Assessments', path: '/assessment#tests', icon: ClipboardList },
      ]
    },
    {
      title: 'CARE & GUIDANCE',
      items: [
        { label: 'AI Companion', path: '/ai-assistant', icon: MessageSquare, badge: '24/7 AI', badgeColor: 'bg-blue-50 text-blue-700' },
        { label: 'Counselors', path: '/counselors', icon: UserCheck },
        { label: 'Appointments', path: '/counselors#appointments', icon: Calendar },
      ]
    },
    {
      title: 'RESOURCES & HUB',
      items: [
        { label: 'Resource Library', path: '/resources', icon: Library },
        { label: 'Solution Hub', path: '/solutions', icon: BookOpen, badge: 'New', badgeColor: 'bg-amber-50 text-amber-700' },
        { label: 'Community', path: '/community', icon: Users },
        { label: 'Campus Portal', path: '/institution', icon: Building2 },
      ]
    }
  ];

  // Nav Sections for Counselors
  const counselorNavSections: NavSection[] = [
    {
      title: 'CLINICAL DASHBOARD',
      items: [
        { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Appointments', path: '/counselors#appointments', icon: Calendar, badge: '3 Today', badgeColor: 'bg-blue-50 text-blue-700' },
        { label: 'Client Directory', path: '/counselors', icon: Users },
      ]
    },
    {
      title: 'CLINICAL TOOLS',
      items: [
        { label: 'Resource Hub', path: '/resources', icon: Library },
        { label: 'Community', path: '/community', icon: Users },
        { label: 'Settings', path: '/dashboard#settings', icon: Settings },
      ]
    }
  ];

  // Nav Sections for Institution Admins
  const institutionNavSections: NavSection[] = [
    {
      title: 'INSTITUTION ANALYTICS',
      items: [
        { label: 'Overview', path: '/institution', icon: Building2 },
        { label: 'Student Wellbeing', path: '/institution#analytics', icon: Heart },
        { label: 'Risk Intelligence', path: '/institution#risk', icon: ShieldAlert, badge: 'Live', badgeColor: 'bg-rose-50 text-rose-700' },
      ]
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { label: 'Counselor Network', path: '/counselors', icon: UserCheck },
        { label: 'Resources', path: '/resources', icon: Library },
        { label: 'Security & Audit', path: '/institution#audit', icon: Lock },
      ]
    }
  ];

  const navSections = userRole === 'institution' || userRole === 'admin'
    ? institutionNavSections
    : userRole === 'counselor'
      ? counselorNavSections
      : studentNavSections;

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#f4f6f9] bg-dot-pattern py-3 px-2 sm:px-4 lg:px-6">
      {/* Outer Application Container Frame */}
      <div className="max-w-[1440px] mx-auto min-h-[94vh] bg-white rounded-[28px] border border-slate-200/80 shadow-2xl shadow-slate-200/50 overflow-hidden flex relative">
        
        {/* ==================== LEFT ATTRACTIVE SIDEBAR ==================== */}
        <aside className={`hidden md:flex flex-col border-r border-slate-200/70 bg-slate-50/40 transition-all duration-300 z-30 ${collapsed ? 'w-20' : 'w-64'}`}>
          
          {/* Sidebar Brand Header */}
          <div className="h-20 px-5 flex items-center justify-between border-b border-slate-200/60 bg-white">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-center font-black text-xl shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
                  Y
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              {!collapsed && (
                <div className="overflow-hidden">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-lg font-black tracking-tight text-slate-900 leading-none group-hover:text-blue-600 transition-colors">YOUTH</span>
                    <span className="bg-blue-50 text-blue-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-blue-200 uppercase">PRO</span>
                  </div>
                  <span className="text-[9px] font-extrabold tracking-wider uppercase text-slate-400 block mt-0.5">Enterprise Wellbeing</span>
                </div>
              )}
            </Link>
            
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200"
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Sidebar Nav Sections */}
          <div className="flex-1 py-4 px-3 overflow-y-auto space-y-6">
            {navSections.map((section, idx) => (
              <div key={idx} className="space-y-1">
                {!collapsed && (
                  <h4 className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                    {section.title}
                  </h4>
                )}
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || (item.path.includes('#') && location.pathname + location.hash === item.path);
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      className={`group flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 translate-x-0.5' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-xs hover:translate-x-0.5'
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                        }`} />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!collapsed && item.badge && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0 ${
                          isActive 
                            ? 'bg-white/20 text-white backdrop-blur-xs' 
                            : (item.badgeColor || 'bg-blue-50 text-blue-700')
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Bottom Sidebar User Profile Card */}
          <div className="p-3 border-t border-slate-200/60 bg-white">
            <div className={`flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/80 border border-slate-200/80 shadow-xs transition-all ${collapsed ? 'justify-center' : ''}`}>
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 ring-2 ring-white rounded-full"></span>
                </div>
                {!collapsed && (
                  <div className="overflow-hidden">
                    <p className="text-xs font-black text-slate-900 truncate leading-tight">{user?.name || 'User'}</p>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider truncate">{userRole}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="text-[9px] font-extrabold text-emerald-600 uppercase">Active</span>
                    </div>
                  </div>
                )}
              </div>

              {!collapsed && (
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* ==================== MAIN CONTENT & TOP HEADER ==================== */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
          
          {/* Top Context Header Bar */}
          <header className="h-20 px-4 sm:px-8 border-b border-slate-200/70 bg-white/80 backdrop-blur-md flex items-center justify-between z-20 shrink-0">
            
            {/* Left: Mobile Toggle & Page Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2.5 rounded-2xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div>
                <div className="flex items-center space-x-2.5">
                  <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">{title}</h1>
                  <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100/80 border border-slate-200/60 px-2.5 py-0.5 rounded-full hidden sm:inline-flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                    {dateStr}
                  </span>
                </div>
                {subtitle && <p className="text-xs text-slate-500 font-medium hidden sm:block mt-0.5">{subtitle}</p>}
              </div>
            </div>

            {/* Right Context Actions */}
            <div className="flex items-center space-x-3">
              
              {/* Quick Search Input */}
              <div className="hidden lg:flex items-center relative w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Quick search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs font-semibold text-slate-800 placeholder-slate-400 pl-8 pr-8 py-2 rounded-xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <kbd className="absolute right-2.5 text-[9px] font-mono font-bold bg-white text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded shadow-xs">
                  ⌘K
                </kbd>
              </div>

              {/* Crisis 24/7 Pill Action */}
              <Link
                to="/crisis"
                className="flex items-center space-x-1.5 text-xs font-extrabold text-rose-600 bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200/80 px-3.5 py-2 rounded-xl transition-all shadow-xs hover:scale-[1.02]"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse shrink-0" />
                <span className="hidden sm:inline">24/7 Crisis</span>
              </Link>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`p-2.5 rounded-xl transition-all relative ${
                    notificationsOpen 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white animate-pulse"></span>
                </button>

                {/* Notifications Dropdown Panel */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-84 bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Notifications</h3>
                        <span className="text-[10px] bg-blue-50 text-blue-700 font-extrabold px-2 py-0.5 rounded-full border border-blue-200/60">
                          1 New
                        </span>
                      </div>
                      <button className="text-[10px] text-blue-600 font-bold hover:underline">Mark all read</button>
                    </div>

                    <div className="space-y-2.5">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50/60 to-indigo-50/40 border border-blue-100 flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Flame className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-slate-900">3-Day Streak Reached!</p>
                          <p className="text-[11px] text-slate-600 font-medium mt-0.5 leading-snug">
                            Complete today's daily wellbeing check-in to unlock your score bonus.
                          </p>
                          <span className="text-[9px] text-slate-400 font-semibold mt-1.5 block">10 mins ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Logout Quick Action */}
              <div className="md:hidden flex items-center">
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600"
                  title="Log out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

            </div>
          </header>

          {/* Primary Scrollable Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#fbfcfd]">
            {children}
          </main>
        </div>

      </div>

      {/* ==================== MOBILE DRAWER OVERLAY ==================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in" onClick={() => setMobileMenuOpen(false)} />
          
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 p-5 animate-in slide-in-from-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg">Y</div>
                <div>
                  <span className="font-black text-slate-900 text-base leading-none block">YOUTH</span>
                  <span className="text-[9px] font-extrabold uppercase text-blue-600 block mt-0.5">Enterprise SaaS</span>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 py-4 space-y-5 overflow-y-auto">
              {navSections.map((section, idx) => (
                <div key={idx} className="space-y-1">
                  <h4 className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
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
                        className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold ${
                          isActive ? 'bg-blue-600 text-white font-extrabold shadow-md shadow-blue-500/20' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase ${
                            isActive ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl text-xs font-extrabold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
