import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle, isLoading, profile } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await signInWithEmail(email, password);
      if (res?.error) {
        setError(res.error);
        return;
      }
      const currentProfile = useAuthStore.getState().profile;
      if (currentProfile?.is_onboarded) {
        navigate('/app/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Supabase OAuth redirects, so this might not strictly hit navigate
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    }
  };

  return (
    <div className="flex h-screen w-full bg-[var(--bg)] text-[var(--text)]">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--navy)] text-white flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--teal)_0%,_transparent_70%)] pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 text-center max-w-md px-8"
        >
          <h1 className="text-5xl font-bold font-['Playfair_Display'] mb-4">D.W.A.R</h1>
          <p className="text-xl text-[var(--teal-soft)] font-medium mb-6">Digital Window for Approval and Registration</p>
          <p className="text-[var(--line)] leading-relaxed">
            The intelligent industrial approval orchestration platform for Maharashtra. 
            Streamline your compliance, track your journey, and grow with confidence.
          </p>
        </motion.div>
      </div>

      {/* Right Panel (Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-2">Welcome back</h2>
            <p className="text-[var(--muted)]">Sign in to your D.W.A.R account to continue</p>
          </div>

          {error && (
            <div className="bg-[var(--warning)] bg-opacity-20 text-[var(--warning)] p-3 rounded-md mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                placeholder="name@company.com"
                className="w-full p-2 border border-[var(--line)] rounded bg-[var(--surface)]"
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                placeholder="••••••••"
                className="w-full p-2 border border-[var(--line)] rounded bg-[var(--surface)]"
              />
            </div>
            
            <button 
              type="submit" 
              className="button primary w-full flex justify-center py-3 bg-[var(--teal)] text-white rounded hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center space-x-4">
            <div className="flex-1 h-px bg-[var(--line)]"></div>
            <span className="text-[var(--muted)] text-sm">or continue with</span>
            <div className="flex-1 h-px bg-[var(--line)]"></div>
          </div>

          <button 
            onClick={handleGoogleSignIn}
            type="button"
            className="button secondary w-full mt-6 flex justify-center items-center py-3 space-x-2 border border-[var(--line)] rounded hover:bg-[var(--surface-2)] transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Google</span>
          </button>

          <p className="mt-8 text-center text-[var(--muted)]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[var(--teal)] hover:text-[var(--navy)] font-medium transition-colors">
              Register
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
