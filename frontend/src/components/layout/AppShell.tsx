import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Sparkles,
  Gamepad2,
  BookMarked,
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
  PhoneCall,
  User,
  Settings,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
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

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close drawers/modals on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileDrawerOpen(false);
        setNotificationsOpen(false);
        setProfileDropdownOpen(false);
        setSettingsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userRole = (user?.role || 'student').toLowerCase();
  const isStudent = userRole === 'student';
  const isCounselor = userRole === 'counselor';
  const isInstitution = userRole === 'institution' || userRole === 'staff';

  // Section 2: Student Primary Essential Sidebar Links
  const studentNavItems = [
    { label: 'Home', path: '/dashboard', icon: Home },
    { label: 'Check-in', path: '/assessment', icon: Sparkles },
    { label: 'Reset', path: '/games', icon: Gamepad2 },
    { label: 'Journal', path: '/solutions', icon: BookMarked },
    { label: 'Support', path: '/ai-assistant', icon: MessageSquare },
    { label: 'Resources', path: '/resources', icon: BookOpen },
  ];

  // Section 3: Counselor Navigation
  const counselorNavItems = [
    { label: 'Overview', path: '/dashboard', icon: Home },
    { label: 'Appointments', path: '/counselors#appointments', icon: Calendar },
    { label: 'Directory', path: '/counselors', icon: UserCheck },
    { label: 'Resources', path: '/resources', icon: BookOpen },
  ];

  // Section 3: Institution Admin Navigation
  const institutionNavItems = [
    { label: 'Dashboard', path: '/institution', icon: Building2 },
    { label: 'Counselors', path: '/counselors', icon: UserCheck },
    { label: 'Resources', path: '/resources', icon: BookOpen },
    { label: 'Reports & Audit', path: '/institution#audit', icon: Lock },
  ];

  // Section 3: Platform Admin Navigation
  const adminNavItems = [
    { label: 'Overview', path: '/dashboard', icon: Home },
    { label: 'Institutions', path: '/institution', icon: Building2 },
    { label: 'Counselors', path: '/counselors', icon: UserCheck },
    { label: 'Resources', path: '/resources', icon: BookOpen },
    { label: 'Audit Logs', path: '/institution#audit', icon: Lock },
  ];

  const currentNavItems = isStudent
    ? studentNavItems
    : isCounselor
    ? counselorNavItems
    : isInstitution
    ? institutionNavItems
    : adminNavItems;

  // Secondary pages accessible via Profile/More Menu (Section 2)
  const studentSecondaryLinks = [
    { label: 'Mindful Resets', path: '/games', icon: Gamepad2 },
    { label: 'Assessments History', path: '/assessment', icon: Sparkles },
    { label: 'Counselor Appointments', path: '/counselors', icon: UserCheck },
    { label: 'Peer Community', path: '/community', icon: Users },
    { label: 'Privacy & Safety Protocol', path: '/crisis', icon: ShieldCheck },
  ];

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const userFirstName = user?.name ? user.name.split(' ')[0] : 'Student';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172033] flex flex-col antialiased selection:bg-indigo-100 selection:text-indigo-900">
      <div className="flex-1 flex w-full max-w-[1440px] mx-auto min-h-screen">
        {/* =========================================================================
            1. AUTHENTICATED DESKTOP SIDEBAR (Slim, Minimal, Collapsible)
            ========================================================================= */}
        <aside
          className={`hidden md:flex flex-col border-r border-slate-200/80 bg-white transition-all duration-200 shrink-0 sticky top-0 h-screen z-20 ${
            sidebarCollapsed ? 'w-16' : 'w-60'
          }`}
          aria-label="Sidebar navigation"
        >
          {/* Logo Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
            <Link
              to={isInstitution ? '/institution' : '/dashboard'}
              className="flex items-center space-x-2.5 overflow-hidden focus:outline-hidden"
              aria-label="YOUTH Dashboard"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                Y
              </div>
              {!sidebarCollapsed && (
                <span className="text-base font-bold tracking-tight text-[#172033] truncate">
                  YOUTH
                </span>
              )}
            </Link>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-150 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:text-[#172033] hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Sidebar Bottom: Profile, Settings, Logout (Section 2) */}
          <div className="p-3 border-t border-slate-100 bg-white space-y-1">
            <button
              onClick={() => setSettingsModalOpen(true)}
              className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-[#172033] hover:bg-slate-50 transition-colors cursor-pointer ${
                sidebarCollapsed ? 'justify-center' : ''
              }`}
              title="Profile & Settings"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center text-xs font-bold shrink-0">
                {userInitial}
              </div>
              {!sidebarCollapsed && (
                <div className="text-left leading-tight truncate flex-1">
                  <p className="text-xs font-bold text-[#172033] truncate">{userFirstName}</p>
                  <p className="text-[10px] text-slate-400 capitalize truncate">{userRole}</p>
                </div>
              )}
            </button>

            {!sidebarCollapsed && (
              <div className="flex items-center justify-between px-2 pt-1">
                <button
                  onClick={() => setSettingsModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 text-[11px] font-medium text-slate-500 hover:text-indigo-600 py-1 transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-1 text-[11px] font-medium text-slate-400 hover:text-rose-600 py-1 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* =========================================================================
            2. MAIN CONTENT AREA & AUTHENTICATED HEADER
            ========================================================================= */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
          {/* Top Header (Slim, Spacious, Role-aware) */}
          <header className="h-16 px-4 sm:px-8 border-b border-slate-200/80 bg-white/95 backdrop-blur-md flex items-center justify-between sticky top-0 z-30 shrink-0">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors focus:outline-hidden"
                aria-label="Open navigation drawer"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-sm sm:text-base font-bold text-[#172033] tracking-tight leading-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs text-slate-500 hidden sm:block leading-none mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Quiet Urgent Help Link */}
              <Link
                to="/crisis"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 px-3 py-1.5 rounded-xl hover:bg-rose-50/70 transition-colors"
                title="Urgent Help & Hotlines"
              >
                <PhoneCall className="w-3.5 h-3.5 text-slate-400 hover:text-rose-500" />
                <span className="hidden xs:inline">Urgent Help</span>
              </Link>

              {/* Real Notifications Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setProfileDropdownOpen(false);
                  }}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative cursor-pointer"
                  title="Notifications"
                  aria-label="View notifications"
                  aria-expanded={notificationsOpen}
                >
                  <Bell className="w-4 h-4" />
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                      <h4 className="text-xs font-bold text-[#172033]">Notifications</h4>
                      <button
                        onClick={() => setNotificationsOpen(false)}
                        className="text-[10px] text-indigo-600 font-semibold hover:underline cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100/60 flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-[#172033]">Daily check-in ready</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                            Take a 60-second moment to record how you are feeling today.
                          </p>
                          <Link
                            to="/assessment"
                            onClick={() => setNotificationsOpen(false)}
                            className="inline-block mt-2 text-[11px] font-bold text-indigo-600 hover:underline"
                          >
                            Start check-in →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Menu Popover */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Open profile menu"
                  aria-expanded={profileDropdownOpen}
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center text-xs font-bold">
                    {userInitial}
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-[#172033] truncate">
                        {user?.name || 'Student Account'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email || 'Confidential Student'}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                        {userRole}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      {isStudent && (
                        <>
                          {studentSecondaryLinks.map((sub) => (
                            <Link
                              key={sub.label}
                              to={sub.path}
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <sub.icon className="w-3.5 h-3.5 text-slate-400" />
                              <span>{sub.label}</span>
                            </Link>
                          ))}
                        </>
                      )}

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setSettingsModalOpen(true);
                        }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        <span>Settings & Privacy</span>
                      </button>
                    </div>

                    <div className="pt-1 mt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {actions && <div>{actions}</div>}
            </div>
          </header>

          {/* Main Content Viewport */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto pb-24 md:pb-10">
            {children}
          </main>
        </div>
      </div>

      {/* =========================================================================
          3. STUDENT MOBILE BOTTOM NAVIGATION (Section 5: 5 Items, 44px min touch target)
          ========================================================================= */}
      {isStudent && (
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200/90 flex items-center justify-around px-1 z-40"
          aria-label="Mobile bottom navigation"
        >
          <Link
            to="/dashboard"
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 text-[10px] font-semibold transition-colors ${
              location.pathname === '/dashboard' ? 'text-indigo-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span>Home</span>
          </Link>

          <Link
            to="/assessment"
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 text-[10px] font-semibold transition-colors ${
              location.pathname === '/assessment' ? 'text-indigo-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Sparkles className="w-5 h-5 mb-0.5" />
            <span>Check-in</span>
          </Link>

          <Link
            to="/solutions"
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 text-[10px] font-semibold transition-colors ${
              location.pathname === '/solutions' ? 'text-indigo-600 font-bold' : 'text-slate-500'
            }`}
          >
            <BookMarked className="w-5 h-5 mb-0.5" />
            <span>Journal</span>
          </Link>

          <Link
            to="/ai-assistant"
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 text-[10px] font-semibold transition-colors ${
              location.pathname === '/ai-assistant' ? 'text-indigo-600 font-bold' : 'text-slate-500'
            }`}
          >
            <MessageSquare className="w-5 h-5 mb-0.5" />
            <span>Support</span>
          </Link>

          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 text-[10px] font-semibold text-slate-500 hover:text-indigo-600 cursor-pointer"
            aria-label="Profile and secondary pages"
          >
            <User className="w-5 h-5 mb-0.5" />
            <span>Profile</span>
          </button>
        </nav>
      )}

      {/* =========================================================================
          4. RESPONSIVE MOBILE / PROFILE DRAWER
          ========================================================================= */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />
          <div
            className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 p-5 transition-transform duration-200 ease-out"
            role="dialog"
            aria-modal="true"
            aria-label="User navigation drawer"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  Y
                </div>
                <div>
                  <p className="font-bold text-[#172033] text-xs leading-none">{userFirstName}</p>
                  <p className="text-[10px] text-slate-400 capitalize mt-0.5">{userRole}</p>
                </div>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav & Secondary Links */}
            <div className="flex-1 py-4 space-y-1 overflow-y-auto">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Main Menu
              </span>
              {currentNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {isStudent && (
                <>
                  <div className="pt-3 mt-3 border-t border-slate-100">
                    <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      More Services
                    </span>
                    {studentSecondaryLinks.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.path}
                        onClick={() => setMobileDrawerOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50"
                      >
                        <sub.icon className="w-4 h-4 text-slate-400" />
                        <span>{sub.label}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              <div className="pt-3 border-t border-slate-100">
                <Link
                  to="/crisis"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50"
                >
                  <PhoneCall className="w-4 h-4 text-rose-600" />
                  <span>24/7 Urgent Help</span>
                </Link>
              </div>
            </div>

            {/* Bottom Sign out */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setSettingsModalOpen(true);
                }}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors min-h-[44px] cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>Account & Privacy</span>
              </button>
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50/50 hover:bg-rose-100 transition-colors min-h-[44px] cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. SETTINGS & PRIVACY MODAL
          ========================================================================= */}
      {settingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setSettingsModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/90 max-w-md w-full p-6 z-10 animate-in fade-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center font-bold text-xs">
                  {userInitial}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#172033]">{user?.name || 'Account Details'}</h3>
                  <p className="text-[11px] text-slate-500">{user?.email || 'Confidential Student'}</p>
                </div>
              </div>
              <button
                onClick={() => setSettingsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Privacy & Safeguard Info */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Pseudonymity Shield Active</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                Your daily check-in evaluations and AI companion logs are protected under pseudonymous university privacy policies.
              </p>
            </div>

            {/* Quick Navigation Links */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Quick Shortcuts
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/assessment"
                  onClick={() => setSettingsModalOpen(false)}
                  className="p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors flex items-center justify-between"
                >
                  <span>Assessments</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </Link>
                <Link
                  to="/counselors"
                  onClick={() => setSettingsModalOpen(false)}
                  className="p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors flex items-center justify-between"
                >
                  <span>Appointments</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setSettingsModalOpen(false);
                  handleLogout();
                }}
                className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Sign out of account
              </button>
              <button
                onClick={() => setSettingsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppShell;


