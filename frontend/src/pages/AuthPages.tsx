import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Brain, Mail, Lock, User, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

interface AuthPagesProps {
  initialMode: 'login' | 'register';
  onNavigate: (page: string) => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({ initialMode, onNavigate }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const { login, register, error, clearError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email || !password) {
      setLocalError("Please fill out all required fields.");
      return;
    }

    if (mode === 'register') {
      if (!fullName) {
        setLocalError("Full name is required.");
        return;
      }
      if (password.length < 6) {
        setLocalError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setLocalError("Passwords do not match.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        onNavigate('dashboard');
      } else {
        await register(email, password, fullName);
        onNavigate('dashboard');
      }
    } catch (e: any) {
      // Errors handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setLocalError(null);
    clearError();
    setPassword('');
    setConfirmPassword('');
  };

  const activeError = localError || error;

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-brand-lightBg dark:bg-brand-darkBg px-6 transition-colors duration-300">
      <div className="absolute inset-0 medical-grid-bg dark:medical-grid-bg-dark opacity-70 pointer-events-none" />
      
      {/* Back Button */}
      <button 
        onClick={() => onNavigate('landing')}
        className="absolute top-6 left-6 flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold transition-all duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {/* Auth Card */}
      <div className="relative w-full max-w-md p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 shadow-2xl backdrop-blur-xl transition-all duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-cyan text-white shadow-lg shadow-brand-blue/20 mb-4">
            <Brain className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-navy dark:text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-brand-slate dark:text-slate-400 mt-1.5 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-brand-cyan" />
            <span>Secure Medical AI Platform Portal</span>
          </p>
        </div>

        {activeError && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-semibold">
            {activeError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <User className="w-4.5 h-4.5" />
                </span>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Dr. John Doe"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-brand-navy dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-sm transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Mail className="w-4.5 h-4.5" />
              </span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@neuroscan.ai"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-brand-navy dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-sm transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock className="w-4.5 h-4.5" />
              </span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-brand-navy dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-sm transition-all"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="w-4.5 h-4.5" />
                </span>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-brand-navy dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-sm transition-all"
                />
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-brand-blue hover:bg-brand-blue/95 disabled:bg-slate-400 text-white font-semibold text-sm shadow-xl shadow-brand-blue/20 flex items-center justify-center space-x-2 transition-all duration-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-200 dark:border-slate-800 pt-6">
          <button 
            onClick={handleToggleMode}
            className="text-sm font-semibold text-brand-blue hover:text-brand-blue/90 hover:underline transition-colors"
          >
            {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};
