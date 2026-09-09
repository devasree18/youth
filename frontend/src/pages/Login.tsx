import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        await signupWithEmail(name, email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || "Failed to authenticate");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans relative overflow-x-hidden flex flex-col">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-50" 
        style={{
          backgroundImage: 'radial-gradient(#d1d5db 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}
      />

      <Navbar />

      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 py-12 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-slate-200"
        >
          {/* Header & Mode Selector */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Secure Access Portal</span>
            </div>
            
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              {isLogin ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {isLogin ? 'Enter your credentials to access your wellbeing dashboard' : 'Join thousands of students on YOUTH platform'}
            </p>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-full mt-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`py-2 rounded-full transition-all ${isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`py-2 rounded-full transition-all ${!isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Sign Up
              </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-3.5 rounded-2xl border border-red-200 mb-6 text-xs text-center font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none transition-all text-xs font-medium text-slate-900 placeholder:text-slate-400" 
                    placeholder="Jane Student"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none transition-all text-xs font-medium text-slate-900 placeholder:text-slate-400" 
                  placeholder="student@university.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none transition-all text-xs font-medium text-slate-900 placeholder:text-slate-400" 
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-2xl hover:bg-slate-800 transition-all shadow-md flex items-center justify-center space-x-2 text-xs uppercase tracking-wider disabled:opacity-50 mt-6"
            >
              <span>{isLoading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}</span>
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center space-x-2 text-[11px] text-emerald-700 font-bold bg-emerald-50 py-2 rounded-xl border border-emerald-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit Encrypted & Institution Scoped</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;

