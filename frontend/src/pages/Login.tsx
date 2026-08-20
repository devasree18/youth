import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginWithEmail, signupWithEmail } = useAuth();
  const navigate = useNavigate();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(name, email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || "Failed to authenticate");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans relative overflow-hidden flex flex-col">
      {/* Subtle Dotted Background */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(#e5e7eb 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px'
      }}></div>

      {/* Top Navigation */}
      <div className="relative z-20 max-w-5xl mx-auto w-full px-6 pt-6 flex justify-between items-center">
        <Link to="/" className="bg-white rounded-full px-4 py-2.5 shadow-sm border border-slate-100 flex items-center space-x-2 text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-600" />
          <span>Back</span>
        </Link>
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 -mt-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <h2 className="text-sm font-bold tracking-[0.2em] text-slate-500 mb-4 uppercase">Access Portal</h2>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              {isLogin ? 'Welcome Back' : 'Join Us'}
            </h1>
          </div>
          
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 mb-6 text-sm text-center font-medium shadow-sm">{error}</div>}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  required={!isLogin}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white rounded-full border border-slate-200 focus:border-slate-800 focus:ring-4 focus:ring-slate-100 outline-none transition-all shadow-sm font-medium text-slate-900 placeholder:text-slate-400" 
                  placeholder="Full Name"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white rounded-full border border-slate-200 focus:border-slate-800 focus:ring-4 focus:ring-slate-100 outline-none transition-all shadow-sm font-medium text-slate-900 placeholder:text-slate-400" 
                placeholder="Email Address"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white rounded-full border border-slate-200 focus:border-slate-800 focus:ring-4 focus:ring-slate-100 outline-none transition-all shadow-sm font-medium text-slate-900 placeholder:text-slate-400" 
                placeholder="Password"
              />
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-full hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 mt-4 uppercase tracking-wider text-sm">
              {isLogin ? 'Sign In to Account' : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-slate-900 font-bold underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;
