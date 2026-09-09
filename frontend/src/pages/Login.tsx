import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Sparkles, ShieldCheck, ArrowRight, Building2, UserCheck } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';

const Login = () => {
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
      setError(err.message || "Failed to authenticate");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans py-4 sm:py-6 px-2 sm:px-4 lg:px-6 flex flex-col">
      <div className="max-w-[1400px] mx-auto min-h-[94vh] bg-white rounded-[28px] sm:rounded-[36px] border border-slate-200/80 shadow-2xl shadow-slate-200/50 overflow-hidden relative flex flex-col w-full">
        
        <Navbar />

        <main className="flex-1 relative bg-dot-pattern py-12 px-4 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-slate-200/90 relative z-10"
          >
            {/* Header & Mode Selector */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-1.5 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enterprise SaaS Access</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1.5">
                {isLogin ? 'Sign in to YOUTH' : 'Create YOUTH Account'}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {isLogin ? 'Enter your email to access your wellbeing workspace' : 'Join thousands of students and institutions'}
              </p>

              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100/80 rounded-2xl mt-5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`py-2 rounded-xl transition-all ${isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`py-2 rounded-xl transition-all ${!isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Sign Up
                </button>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 mb-5 text-xs text-center font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Role Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'student', label: 'Student', icon: User },
                        { id: 'counselor', label: 'Counselor', icon: UserCheck },
                        { id: 'institution', label: 'Campus', icon: Building2 },
                      ].map((r) => {
                        const Icon = r.icon;
                        const isSelected = role === r.id;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setRole(r.id as any)}
                            className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                              isSelected
                                ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{r.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        required={!isLogin}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 focus:bg-white outline-none transition-all text-xs font-semibold text-slate-900 placeholder:text-slate-400" 
                        placeholder="Jane Student"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 focus:bg-white outline-none transition-all text-xs font-semibold text-slate-900 placeholder:text-slate-400" 
                    placeholder="user@university.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 focus:bg-white outline-none transition-all text-xs font-semibold text-slate-900 placeholder:text-slate-400" 
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 text-xs uppercase tracking-wider disabled:opacity-50 mt-5 active:scale-[0.98]"
              >
                <span>{isLoading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}</span>
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center space-x-2 text-[11px] text-emerald-800 font-bold bg-emerald-50 py-2 rounded-xl border border-emerald-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>256-Bit Encrypted & Privacy Protected</span>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Login;


