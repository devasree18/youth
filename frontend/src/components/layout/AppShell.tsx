import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Heart,
  Smile,
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
  Lock
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AppShell: React.FC<AppShellProps> = ({ children, title = "Dashboard", subtitle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userRole = user?.role || 'student';

  // Role-Specific Navigation items
  const studentNavItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Wellbeing', path: '/assessment', icon: Heart },
    { label: 'Mood Log', path: '/dashboard#mood', icon: Smile },
    { label: 'Assessments', path: '/assessment', icon: ClipboardList },
    { label: 'AI Support', path: '/ai-assistant', icon: MessageSquare },
    { label: 'Resources', path: '/resources', icon: Library },
    { label: 'Community', path: '/community', icon: Users },
    { label: 'Counselors', path: '/counselors', icon: UserCheck },
    { label: 'Appointments', path: '/counselors#appointments', icon: Calendar },
    { label: 'Solution Hub', path: '/solutions', icon: BookOpen },
  ];

  const counselorNavItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Appointments', path: '/counselors#appointments', icon: Calendar },
    { label: 'Client Directory', path: '/counselors', icon: Users },
    { label: 'Resources', path: '/resources', icon: Library },
    { label: 'Settings', path: '/dashboard#settings', icon: Settings },
  ];

  const institutionNavItems = [
    { label: 'Overview', path: '/institution', icon: Building2 },
    { label: 'Student Wellbeing', path: '/institution#analytics', icon: Heart },
    { label: 'Risk Intelligence', path: '/institution#risk', icon: ShieldAlert },
    { label: 'Counselor Network', path: '/counselors', icon: UserCheck },
    { label: 'Resources', path: '/resources', icon: Library },
    { label: 'Security & Audit', path: '/institution#audit', icon: Lock },
  ];

  const navItems = userRole === 'institution' || userRole === 'admin'
    ? institutionNavItems
    : userRole === 'counselor'
      ? counselorNavItems
      : studentNavItems;

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#f4f6f9] bg-dot-pattern py-4 px-2 sm:px-4 lg:px-6">
      {/* Outer Application Frame - Matching reference benchmark image */}
      <div className="max-w-[1440px] mx-auto min-h-[92vh] bg-white rounded-[28px] border border-slate-200/80 shadow-2xl shadow-slate-200/50 overflow-hidden flex relative">
        
        {/* Left Sidebar - Desktop */}
        <aside className={`hidden md:flex flex-col border-r border-slate-100 bg-white transition-all duration-300 z-30 ${collapsed ? 'w-20' : 'w-64'}`}>
          {/* Sidebar Brand Header */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-blue-500/20 shrink-0">
                Y
              </div>
              {!collapsed && (
                <div>
                  <span className="text-lg font-black tracking-tight text-slate-900 block leading-none">YOUTH</span>
                  <span className="text-[9px] font-bold tracking-wider uppercase text-blue-600 block mt-0.5">Enterprise SaaS</span>
                </div>
              )}
            </Link>
            
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Nav Items */}
          <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path.includes('#') && location.pathname + location.hash === item.path);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 font-bold shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>

          {/* Bottom Sidebar User Profile Card */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 shadow-sm">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                {!collapsed && (
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
                    <p className="text-[10px] text-slate-500 capitalize truncate">{userRole}</p>
                  </div>
                )}
              </div>
              {!collapsed && (
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
          
          {/* Top Context Header Bar */}
          <header className="h-20 px-4 sm:px-8 border-b border-slate-100 bg-white flex items-center justify-between z-20 shrink-0">
            {/* Left: Mobile Toggle & Page Title */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">{title}</h1>
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md hidden sm:inline-block">
                    {dateStr}
                  </span>
                </div>
                {subtitle && <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>}
              </div>
            </div>

            {/* Right Context Actions */}
            <div className="flex items-center space-x-3">
              {/* Crisis 24/7 Action */}
              <Link
                to="/crisis"
                className="flex items-center space-x-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/80 px-3 py-1.5 rounded-xl transition-all shadow-sm"
              >
                <ShieldAlert className="w-4 h-4 text-red-600 animate-pulse" />
                <span className="hidden sm:inline">24/7 Crisis</span>
              </Link>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Notifications</h3>
                      <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full">1 New</span>
                    </div>
                    <div className="space-y-3">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-xs font-semibold text-slate-800">Daily Wellbeing Check-in</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Your streak is at 3 days. Complete today's check-in to keep it going!</p>
                        <span className="text-[9px] text-slate-400 mt-1 block">10 mins ago</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar Dropdown Mobile */}
              <div className="md:hidden flex items-center">
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600"
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

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 p-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">Y</div>
                <span className="font-black text-slate-900">YOUTH</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                      isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-slate-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-bold text-red-600 bg-red-50"
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
