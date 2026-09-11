import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Building2, UserCheck, Shield, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Alert } from '../components/ui/alert';
import { fadeUpVariants } from '../lib/motion';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'counselor' | 'institution'>('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithEmail, signupWithEmail } = useAuth();
  const navigate = useNavigate();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(name, email, password, role);
      }
      if (role === 'institution') {
        navigate('/institution');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between antialiased">
      {/* Top minimal header */}
      <header className="h-16 px-4 sm:px-8 border-b border-slate-200/80 bg-white flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            Y
          </div>
          <span className="text-base font-bold tracking-tight text-[#172033]">YOUTH</span>
        </Link>
        <Link
          to="/"
          className="text-xs font-semibold text-slate-600 hover:text-[#172033] transition-colors"
        >
          Back to homepage
        </Link>
      </header>

      {/* Main centered card */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs"
        >
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-[#172033] tracking-tight">
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
                className={`py-2 rounded-lg transition-all cursor-pointer ${
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
                className={`py-2 rounded-lg transition-all cursor-pointer ${
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
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs transition-all cursor-pointer active:scale-[0.98] ${
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
              required
              placeholder="you@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="default"
                className="w-full"
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

      {/* Minimal Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200/80 bg-white">
        © {new Date().getFullYear()} YOUTH Student Wellbeing. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
