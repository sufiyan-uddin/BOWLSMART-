'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, ArrowRight, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 1200);
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

            <button type="submit" className="btn-primary w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

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
      `}</style>
    </div>
  );
}
