import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Building2, UserCheck, Shield, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Alert } from '../components/ui/alert';
import { fadeUpVariants } from '../lib/motion';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'student' | 'counselor' | 'institution'>('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithEmail, signupWithEmail } = useAuth();
  const navigate = useNavigate();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      let authUser;
      if (isLogin) {
        authUser = await loginWithEmail(cleanEmail, password);
      } else {
        authUser = await signupWithEmail(name.trim(), cleanEmail, password, role);
      }

      const userRole = (authUser.role || '').toUpperCase();
      if (userRole === 'INSTITUTION' || userRole === 'INSTITUTION_ADMIN' || userRole === 'INSTITUTION_STAFF' || userRole === 'ADMIN') {
        navigate('/institution');
      } else if (userRole === 'COUNSELOR') {
        navigate('/counselors');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between antialiased w-full overflow-x-hidden">
      {/* Top minimal header with safe top padding on mobile */}
      <header className="pt-[env(safe-area-inset-top,0px)] px-4 sm:px-8 border-b border-slate-200/80 bg-white flex items-center justify-between min-h-[4rem]">
        <Link to="/" className="flex items-center space-x-2.5 py-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            Y
          </div>
          <span className="text-base font-bold tracking-tight text-[#172033]">YOUTH</span>
        </Link>
        <Link
          to="/"
          className="text-xs font-semibold text-slate-600 hover:text-[#172033] transition-colors py-2 px-3 rounded-lg min-h-[40px] flex items-center"
        >
          Back to home
        </Link>
      </header>

      {/* Main centered card */}
      <main className="flex-1 flex items-center justify-center p-4 py-8 sm:py-12">
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-xs"
        >
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
              {isLogin ? 'Sign in to YOUTH' : 'Create your YOUTH account'}
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-normal">
              {isLogin
                ? 'Enter your credentials to access your wellbeing workspace'
                : 'Join your campus mental health ecosystem'}
            </p>

            {/* Auth tab toggle */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl mt-5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
                className={`py-2.5 rounded-lg transition-all cursor-pointer min-h-[40px] ${
                  isLogin ? 'bg-white text-[#172033] font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
                className={`py-2.5 rounded-lg transition-all cursor-pointer min-h-[40px] ${
                  !isLogin ? 'bg-white text-[#172033] font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4">
              <Alert variant="error">{error}</Alert>
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="signup-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="space-y-4 overflow-hidden"
                >
                  <Input
                    label="Full Name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="e.g. Alex Johnson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    leftIcon={<User className="w-4 h-4" />}
                  />

                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-bold text-slate-700 tracking-tight">
                      Account Role
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'student', label: 'Student', icon: User },
                        { id: 'counselor', label: 'Counselor', icon: UserCheck },
                        { id: 'institution', label: 'Institution', icon: Building2 },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSelected = role === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setRole(item.id as any)}
                            className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border text-xs transition-all cursor-pointer active:scale-[0.98] min-h-[52px] ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold shadow-xs ring-2 ring-indigo-500/20'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Input
              label="Email Address"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="you@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              rightAction={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="default"
                className="w-full min-h-[44px]"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {isLogin ? 'Sign In to Workspace' : 'Create Account'}
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center space-x-2 text-slate-400 text-[11px] font-medium">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Encrypted & Privacy Guarded</span>
          </div>
        </motion.div>
      </main>

      {/* Minimal Footer with safe bottom padding */}
      <footer className="py-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] text-center text-xs text-slate-400 border-t border-slate-200/80 bg-white">
        © {new Date().getFullYear()} YOUTH Student Wellbeing. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;

