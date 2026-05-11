'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, ArrowRight, Mail, Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { user, signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await signInWithGoogle();
    if (error) setError(error.message);
  };

  return (
    <div className="login-page">
      <div className="bg-mesh" />
      
      <div className="login-container">
        <Link href="/" className="login-logo animate-fade-in-up">
          <div className="logo-icon">
            <Zap size={20} />
          </div>
          <span className="logo-text">BowlSmart</span>
        </Link>
        
        <div className="login-card glass-card animate-fade-in-up delay-100">
          <div className="card-header">
            <h2>Welcome Back</h2>
            <p>Log in to access your analysis and coaching tools.</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  placeholder="coach@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Password
                <a href="#" className="forgot-link">Forgot?</a>
              </label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="error-msg">
                <AlertTriangle size={14} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <button className="btn-google" onClick={handleGoogleLogin}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="card-footer">
            Don&apos;t have an account? <Link href="/onboarding" className="signup-link">Sign up</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
        }
        
        .login-container {
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          position: relative;
          z-index: 1;
        }

        .login-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: white;
        }
        .logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--color-brand-600), var(--color-brand-700));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .logo-text {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .login-card {
          width: 100%;
          padding: 2.5rem;
        }

        .card-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .card-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .card-header p {
          color: var(--color-text-secondary);
          font-size: 0.9375rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-primary);
          display: flex;
          justify-content: space-between;
        }

        .forgot-link {
          color: var(--color-brand-400);
          text-decoration: none;
          font-size: 0.8125rem;
        }
        .forgot-link:hover {
          color: var(--color-brand-300);
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: var(--color-text-muted);
        }

        .input-wrapper input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 2.75rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: white;
          font-size: 0.9375rem;
          transition: all 0.2s;
        }

        .input-wrapper input:focus {
          outline: none;
          border-color: var(--color-brand-500);
          background: rgba(255,255,255,0.05);
          box-shadow: 0 0 0 4px rgba(43, 141, 255, 0.1);
        }

        .w-full {
          width: 100%;
          justify-content: center;
        }

        .card-footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.9375rem;
          color: var(--color-text-secondary);
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 1.5rem;
        }

        .signup-link {
          color: white;
          font-weight: 600;
          text-decoration: none;
        }
        .signup-link:hover {
          text-decoration: underline;
        }

        .error-msg {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
          color: #f87171;
          font-size: 0.8125rem;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.5rem 0;
          color: var(--color-text-muted);
          font-size: 0.8125rem;
        }
        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }

        .btn-google {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          color: white;
          font-size: 0.9375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-google:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}
