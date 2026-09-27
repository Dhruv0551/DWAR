import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { Loader2 } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithGoogle, isLoading } = useAuthStore();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    if (score < 2) return 'weak';
    if (score < 4) return 'medium';
    return 'strong';
  };

  const strength = password ? calculateStrength(password) : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      await signUpWithEmail(email, password, fullName);
      setSuccess(true);
      // Wait a moment then go to onboarding
      setTimeout(() => navigate('/onboarding'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
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
          <p className="text-xl text-[var(--teal-soft)] font-medium mb-6">Begin your journey today</p>
          <p className="text-[var(--line)] leading-relaxed">
            Create an account to access a unified portal for all your industrial compliance and approval needs in Maharashtra.
          </p>
        </motion.div>
      </div>

      {/* Right Panel (Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md py-8"
        >
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-2">Create account</h2>
            <p className="text-[var(--muted)]">Join D.W.A.R and streamline your approvals</p>
          </div>

          {error && (
            <div className="bg-[var(--warning)] bg-opacity-20 text-[var(--warning)] p-3 rounded-md mb-6 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-[var(--teal)] bg-opacity-20 text-[var(--teal)] p-3 rounded-md mb-6 text-sm">
              Registration successful! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="field">
              <label htmlFor="fullName">Full Name</label>
              <input 
                id="fullName" 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required 
                placeholder="John Doe"
                className="w-full p-2 border border-[var(--line)] rounded bg-[var(--surface)]"
              />
            </div>
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
              {password && (
                <div className="mt-1 flex items-center space-x-2 text-xs">
                  <div className="flex-1 flex gap-1 h-1">
                    <div className={`h-full flex-1 rounded ${strength === 'weak' ? 'bg-red-500' : strength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                    <div className={`h-full flex-1 rounded ${(strength === 'medium' || strength === 'strong') ? (strength === 'medium' ? 'bg-yellow-500' : 'bg-green-500') : 'bg-[var(--line)]'}`} />
                    <div className={`h-full flex-1 rounded ${strength === 'strong' ? 'bg-green-500' : 'bg-[var(--line)]'}`} />
                  </div>
                  <span className="text-[var(--muted)] capitalize">{strength}</span>
                </div>
              )}
            </div>
            <div className="field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                id="confirmPassword" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
                placeholder="••••••••"
                className="w-full p-2 border border-[var(--line)] rounded bg-[var(--surface)]"
              />
            </div>
            
            <button 
              type="submit" 
              className="button primary w-full flex justify-center py-3 mt-6 bg-[var(--teal)] text-white rounded hover:opacity-90 transition-opacity"
              disabled={isLoading || success}
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create account'}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center space-x-4">
            <div className="flex-1 h-px bg-[var(--line)]"></div>
            <span className="text-[var(--muted)] text-sm">or</span>
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
            <span>Continue with Google</span>
          </button>

          <p className="mt-8 text-center text-[var(--muted)]">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--teal)] hover:text-[var(--navy)] font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
