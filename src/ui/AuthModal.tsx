/**
 * Auth Modal
 * 
 * Handles signup, login, and beta code entry.
 * Uses Supabase for authentication.
 */

import { useState } from 'react';
import { signIn, signUp, isSupabaseConfigured } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type AuthMode = 'login' | 'signup' | 'beta';

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [betaCode, setBetaCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        // Demo mode - just pretend it worked
        setSuccess('Demo mode: Auth would work when Supabase is configured');
        setTimeout(() => {
          onSuccess?.();
        }, 1500);
        return;
      }

      if (mode === 'login') {
        await signIn(email, password);
        setSuccess('Logged in successfully!');
        setTimeout(() => onSuccess?.(), 1000);
      } else {
        // Signup (with optional beta code)
        await signUp(email, password);
        
        // TODO: Validate beta code against beta_codes table
        if (mode === 'beta' && betaCode) {
          // Store beta code claim in profile after email confirmation
          console.log('Beta code to validate:', betaCode);
        }
        
        setSuccess('Check your email for a confirmation link!');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#faf6f0] rounded-2xl max-w-md w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#3d3428]">
            {mode === 'login' ? 'Welcome Back' : mode === 'beta' ? 'Join Beta' : 'Create Account'}
          </h2>
          <button 
            onClick={onClose}
            className="text-2xl text-[#6b5d4d] hover:text-[#3d3428] transition-colors"
          >
            ×
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'signup', label: 'Sign Up', icon: '✨' },
            { key: 'beta', label: 'Beta Access', icon: '⭐' },
            { key: 'login', label: 'Log In', icon: '👋' },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => { setMode(key as AuthMode); setError(null); setSuccess(null); }}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                mode === key
                  ? 'bg-[#7cb56b] text-white'
                  : 'bg-[#ebe3d5] text-[#6b5d4d] hover:bg-[#d4c9b8]'
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#3d3428] mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hero@xpira.io"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#d4c9b8] focus:border-[#7cb56b] outline-none text-[#3d3428] bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3d3428] mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'login' ? '••••••••' : 'Create a password'}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#d4c9b8] focus:border-[#7cb56b] outline-none text-[#3d3428] bg-white"
              required
              minLength={6}
            />
          </div>

          {/* Beta Code Field */}
          {mode === 'beta' && (
            <div>
              <label className="block text-sm font-medium text-[#3d3428] mb-1">
                Beta Invite Code
              </label>
              <input
                type="text"
                value={betaCode}
                onChange={(e) => setBetaCode(e.target.value.toUpperCase())}
                placeholder="XPIRA-BETA-XXXX"
                className="w-full px-4 py-3 rounded-xl border-2 border-[#9b7bb5] focus:border-[#8a6aa4] outline-none text-[#3d3428] bg-white font-mono uppercase tracking-wider"
                required
              />
              <p className="text-xs text-[#9a8b7a] mt-1">
                Don't have a code? <a href="#" className="text-[#9b7bb5] hover:underline">Request one</a>
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
              mode === 'beta'
                ? 'bg-[#9b7bb5] hover:bg-[#8a6aa4]'
                : 'bg-[#7cb56b] hover:bg-[#5a9a4a]'
            } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Processing...
              </span>
            ) : mode === 'login' ? (
              'Log In'
            ) : mode === 'beta' ? (
              '⭐ Join Beta'
            ) : (
              '✨ Create Account'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#ebe3d5] text-center">
          {mode === 'login' ? (
            <p className="text-sm text-[#6b5d4d]">
              New to XPira?{' '}
              <button 
                onClick={() => setMode('signup')} 
                className="text-[#7cb56b] hover:underline font-medium"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p className="text-sm text-[#6b5d4d]">
              Already have an account?{' '}
              <button 
                onClick={() => setMode('login')} 
                className="text-[#7cb56b] hover:underline font-medium"
              >
                Log in
              </button>
            </p>
          )}
        </div>

        {/* Not configured warning */}
        {!isSupabaseConfigured && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-xs text-center">
            🔧 Supabase not configured. Running in demo mode.
          </div>
        )}
      </div>
    </div>
  );
}
