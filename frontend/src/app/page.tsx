'use client';

import { useState, useEffect } from 'react';
import { 
  Activity, Zap, Shield, Target, ChevronRight, Play, 
  TrendingUp, Award, BarChart3, Video, Brain, Users,
  ArrowRight, Check, Star, Menu, X
} from 'lucide-react';
import Link from 'next/link';

/* ═══════════════════════════════════════════════════
   LANDING PAGE — BowlSmart
   ═══════════════════════════════════════════════════ */

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">
      <div className="bg-mesh" />

      {/* ── Navbar ── */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            <div className="logo-icon">
              <Zap size={20} />
            </div>
            <span className="logo-text">BowlSmart</span>
          </Link>

          <div className="nav-links hide-mobile">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#pricing">Pricing</a>
          </div>

          <div className="nav-actions hide-mobile">
            <Link href="/login" className="btn-secondary btn-sm">Log In</Link>
            <Link href="/onboarding" className="btn-primary btn-sm">Get Started Free</Link>
          </div>

          <button 
            className="mobile-menu-btn hide-desktop"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <Link href="/login" className="btn-secondary" style={{ width: '100%' }}>Log In</Link>
            <Link href="/onboarding" className="btn-primary" style={{ width: '100%' }}>Get Started Free</Link>
          </div>
        )}
      </nav>

      {/* ── Hero Section ── */}
      <section className="hero-section">
        <div className="hero-bg-elements">
          <div className="hero-glow-1" />
          <div className="hero-glow-2" />
          <div className="hero-grid" />
        </div>

        <div className="hero-content">
          <div className="hero-badge animate-fade-in-up">
            <Zap size={14} />
            <span>AI-Powered Bowling Analysis</span>
          </div>

          <h1 className="hero-title animate-fade-in-up delay-100">
            Unlock Your <span className="gradient-text">Hidden Pace</span>
          </h1>

          <p className="hero-subtitle animate-fade-in-up delay-200">
            Every fast bowler has untapped pace. BowlSmart uses AI video analysis to find 
            where you&apos;re leaking speed, assess your injury risk, and build a personalized 
            coaching plan to bowl faster and safer.
          </p>

          <div className="hero-actions animate-fade-in-up delay-300">
            <Link href="/onboarding" className="btn-primary btn-lg">
              Analyze Your Action
              <ArrowRight size={18} />
            </Link>
            <button className="btn-secondary btn-lg">
              <Play size={18} />
              Watch Demo
            </button>
          </div>

          <div className="hero-stats animate-fade-in-up delay-400">
            <div className="hero-stat">
              <span className="hero-stat-value">87%</span>
              <span className="hero-stat-label">Bowlers found pace leaks</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">12 km/h</span>
              <span className="hero-stat-label">Average pace increase</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">60s</span>
              <span className="hero-stat-label">Analysis time</span>
            </div>
          </div>
        </div>

        {/* Hero Visual – Animated Analysis Preview */}
        <div className="hero-visual animate-fade-in-up delay-500">
          <div className="hero-mockup">
            <div className="mockup-header">
              <div className="mockup-dots">
                <span /><span /><span />
              </div>
              <span className="mockup-title">Bowling Analysis Report</span>
            </div>
            <div className="mockup-body">
              <div className="mockup-score-section">
                <div className="mockup-score-ring">
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" className="score-ring-track" />
                    <circle 
                      cx="50" cy="50" r="42" 
                      className="score-ring-fill"
                      stroke="url(#scoreGrad)" 
                      strokeDasharray={`${2 * Math.PI * 42 * 0.78} ${2 * Math.PI * 42}`}
                    />
                    <defs>
                      <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2b8dff" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="mockup-score-label">
                    <span className="mockup-score-num">78</span>
                    <span className="mockup-score-max">/100</span>
                  </div>
                </div>
                <div className="mockup-score-info">
                  <span className="mockup-score-title">Form Score</span>
                  <span className="mockup-score-desc">Good foundation — 3 areas to unlock more pace</span>
                </div>
              </div>

              <div className="mockup-phases">
                {['Run-up', 'Bound', 'BFC', 'FFC', 'Delivery', 'Follow'].map((phase, i) => {
                  const scores = [8, 7, 6, 5, 8, 7];
                  const colors = ['#22c55e', '#22c55e', '#f97316', '#ef4444', '#22c55e', '#22c55e'];
                  return (
                    <div key={phase} className="mockup-phase" style={{ animationDelay: `${i * 150 + 800}ms` }}>
                      <div className="mockup-phase-bar" style={{ 
                        height: `${scores[i] * 10}%`,
                        background: `linear-gradient(to top, ${colors[i]}88, ${colors[i]})`
                      }} />
                      <span className="mockup-phase-label">{phase}</span>
                      <span className="mockup-phase-score" style={{ color: colors[i] }}>{scores[i]}/10</span>
                    </div>
                  );
                })}
              </div>

              <div className="mockup-insight">
                <Brain size={14} style={{ color: '#f97316', flexShrink: 0 }} />
                <span>Front knee collapse at front-foot contact is costing you <strong>8–12 km/h</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header animate-fade-in-up">
            <span className="section-eyebrow">FEATURES</span>
            <h2 className="section-title">Your AI Bowling Coach</h2>
            <p className="section-subtitle">
              From video upload to personalized drills — everything you need to bowl faster and safer.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, i) => (
              <div key={feature.title} className="feature-card glass-card animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="feature-icon" style={{ background: feature.iconBg }}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="how-section">
        <div className="section-container">
          <div className="section-header animate-fade-in-up">
            <span className="section-eyebrow">HOW IT WORKS</span>
            <h2 className="section-title">Three Steps to More Pace</h2>
          </div>

          <div className="steps-grid">
            {steps.map((step, i) => (
              <div key={step.title} className="step-card animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="step-number">{String(i + 1).padStart(2, '0')}</div>
                <div className="step-icon-wrap">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="step-connector hide-mobile">
                    <ChevronRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Section ── */}
      <section id="pricing" className="pricing-section">
        <div className="section-container">
          <div className="section-header animate-fade-in-up">
            <span className="section-eyebrow">PRICING</span>
            <h2 className="section-title">Choose Your Plan</h2>
            <p className="section-subtitle">
              Start free, upgrade when you&apos;re ready to dominate.
            </p>
          </div>

          <div className="pricing-grid">
            {plans.map((plan, i) => (
              <div 
                key={plan.name} 
                className={`pricing-card glass-card animate-fade-in-up ${plan.popular ? 'popular' : ''}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price">
                  <span className="plan-amount">{plan.price}</span>
                  {plan.period && <span className="plan-period">{plan.period}</span>}
                </div>
                <p className="plan-desc">{plan.desc}</p>
                <ul className="plan-features">
                  {plan.features.map((f) => (
                    <li key={f}>
                      <Check size={16} className="plan-check" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/onboarding" className={plan.popular ? 'btn-primary' : 'btn-secondary'} style={{ width: '100%' }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-card glass-card-static">
            <div className="cta-glow" />
            <h2 className="cta-title animate-fade-in-up">
              Ready to Find Your <span className="gradient-text">Hidden Pace</span>?
            </h2>
            <p className="cta-subtitle animate-fade-in-up delay-100">
              Upload your bowling video and get your AI analysis in under 60 seconds. Free.
            </p>
            <div className="animate-fade-in-up delay-200">
              <Link href="/onboarding" className="btn-accent btn-lg">
                Start Free Analysis
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="section-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="nav-logo">
                <div className="logo-icon"><Zap size={18} /></div>
                <span className="logo-text">BowlSmart</span>
              </div>
              <p className="footer-brand-desc">
                AI-powered fast bowling coaching. Unlock your pace potential safely.
              </p>
            </div>
            <div className="footer-links">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#how-it-works">How It Works</a>
            </div>
            <div className="footer-links">
              <h4>Support</h4>
              <a href="#">Help Center</a>
              <a href="#">Contact</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 BowlSmart. All rights reserved.</p>
            <p className="footer-disclaimer">
              ⚠️ AI-generated analysis. Consult a qualified coach or physiotherapist for medical decisions.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .landing-page {
          position: relative;
        }

        /* ── Navbar ── */
        .landing-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 1rem 0;
          transition: all 0.3s;
        }
        .landing-nav.scrolled {
          background: rgba(3, 7, 18, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding: 0.75rem 0;
        }
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: white;
        }
        .logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--color-brand-600), var(--color-brand-700));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .logo-text {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .nav-links {
          display: flex;
          gap: 2rem;
        }
        .nav-links a {
          color: var(--color-text-secondary);
          text-decoration: none;
          font-size: 0.9375rem;
          font-weight: 500;
          transition: color 0.2s;
        }
        .nav-links a:hover {
          color: white;
        }
        .nav-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        .mobile-menu-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0.5rem;
        }
        .mobile-menu {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.5rem;
          background: rgba(3, 7, 18, 0.95);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .mobile-menu a {
          color: var(--color-text-secondary);
          text-decoration: none;
          font-size: 1rem;
          padding: 0.5rem 0;
        }

        /* ── Hero ── */
        .hero-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8rem 1.5rem 4rem;
          position: relative;
          overflow: hidden;
        }
        .hero-bg-elements {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .hero-glow-1 {
          position: absolute;
          top: 10%;
          left: 20%;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(43,141,255,0.12) 0%, transparent 70%);
          filter: blur(60px);
        }
        .hero-glow-2 {
          position: absolute;
          bottom: 10%;
          right: 15%;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%);
          filter: blur(60px);
        }
        .hero-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
        }
        .hero-content {
          max-width: 800px;
          text-align: center;
          position: relative;
          z-index: 1;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(43,141,255,0.1);
          border: 1px solid rgba(43,141,255,0.2);
          border-radius: 999px;
          color: var(--color-brand-400);
          font-size: 0.8125rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 1.5rem;
        }
        .hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: var(--color-text-secondary);
          line-height: 1.6;
          margin-bottom: 2.5rem;
          max-width: 640px;
          margin-left: auto;
          margin-right: auto;
        }
        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 3rem;
        }
        .hero-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .hero-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .hero-stat-value {
          font-size: 1.75rem;
          font-weight: 800;
          color: white;
        }
        .hero-stat-label {
          font-size: 0.8125rem;
          color: var(--color-text-muted);
        }
        .hero-stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(255,255,255,0.1);
        }

        /* ── Hero Mockup ── */
        .hero-visual {
          margin-top: 3rem;
          width: 100%;
          max-width: 700px;
          position: relative;
          z-index: 1;
        }
        .hero-mockup {
          background: rgba(17, 24, 39, 0.9);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .mockup-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1.25rem;
          background: rgba(0,0,0,0.3);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .mockup-dots {
          display: flex;
          gap: 6px;
        }
        .mockup-dots span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
        }
        .mockup-dots span:first-child { background: #ef4444; }
        .mockup-dots span:nth-child(2) { background: #eab308; }
        .mockup-dots span:last-child { background: #22c55e; }
        .mockup-title {
          font-size: 0.8125rem;
          color: var(--color-text-muted);
        }
        .mockup-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .mockup-score-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .mockup-score-ring {
          position: relative;
          width: 100px;
          height: 100px;
          flex-shrink: 0;
        }
        .mockup-score-ring svg {
          transform: rotate(-90deg);
          width: 100%;
          height: 100%;
        }
        .mockup-score-label {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mockup-score-num {
          font-size: 1.75rem;
          font-weight: 800;
        }
        .mockup-score-max {
          font-size: 0.875rem;
          color: var(--color-text-muted);
        }
        .mockup-score-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .mockup-score-title {
          font-size: 0.875rem;
          color: var(--color-text-muted);
        }
        .mockup-score-desc {
          font-size: 0.9375rem;
          font-weight: 500;
        }
        .mockup-phases {
          display: flex;
          gap: 8px;
          align-items: flex-end;
          height: 100px;
        }
        .mockup-phase {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          height: 100%;
          justify-content: flex-end;
          animation: fadeInUp 0.5s ease both;
        }
        .mockup-phase-bar {
          width: 100%;
          border-radius: 4px 4px 0 0;
          min-height: 10px;
          transition: height 1s var(--ease-spring);
        }
        .mockup-phase-label {
          font-size: 0.625rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }
        .mockup-phase-score {
          font-size: 0.6875rem;
          font-weight: 700;
        }
        .mockup-insight {
          display: flex;
          align-items: flex-start;
          gap: 0.625rem;
          padding: 0.75rem 1rem;
          background: rgba(249, 115, 22, 0.08);
          border: 1px solid rgba(249, 115, 22, 0.15);
          border-radius: 10px;
          font-size: 0.8125rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }
        .mockup-insight strong {
          color: var(--color-accent-400);
        }

        /* ── Features Section ── */
        .features-section {
          padding: 6rem 1.5rem;
        }
        .section-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .section-eyebrow {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: var(--color-brand-400);
          margin-bottom: 0.75rem;
        }
        .section-title {
          font-size: clamp(1.75rem, 4vw, 2.75rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 1rem;
        }
        .section-subtitle {
          font-size: 1.0625rem;
          color: var(--color-text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }
        .feature-card {
          padding: 2rem;
        }
        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          color: white;
        }
        .feature-title {
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .feature-desc {
          font-size: 0.9375rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
        }

        /* ── How It Works ── */
        .how-section {
          padding: 6rem 1.5rem;
          background: rgba(255,255,255,0.01);
        }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }
        .step-card {
          position: relative;
          text-align: center;
          padding: 2.5rem 2rem;
        }
        .step-number {
          font-size: 3rem;
          font-weight: 900;
          background: linear-gradient(135deg, rgba(43,141,255,0.2), rgba(249,115,22,0.1));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }
        .step-icon-wrap {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(43,141,255,0.15), rgba(139,92,246,0.1));
          border: 1px solid rgba(43,141,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
          color: var(--color-brand-400);
        }
        .step-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }
        .step-desc {
          font-size: 0.9375rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
        }
        .step-connector {
          position: absolute;
          right: -1.5rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
        }

        /* ── Pricing ── */
        .pricing-section {
          padding: 6rem 1.5rem;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        .pricing-card {
          padding: 2.5rem 2rem;
          position: relative;
        }
        .pricing-card.popular {
          border-color: rgba(43,141,255,0.3);
          box-shadow: 0 0 40px rgba(43,141,255,0.1);
        }
        .popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          padding: 0.25rem 1rem;
          background: linear-gradient(135deg, var(--color-brand-600), var(--color-brand-700));
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
          color: white;
        }
        .plan-name {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .plan-price {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
          margin-bottom: 0.75rem;
        }
        .plan-amount {
          font-size: 2.5rem;
          font-weight: 900;
        }
        .plan-period {
          font-size: 0.9375rem;
          color: var(--color-text-muted);
        }
        .plan-desc {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }
        .plan-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }
        .plan-features li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }
        .plan-check {
          color: var(--color-success-400);
          flex-shrink: 0;
        }

        /* ── CTA ── */
        .cta-section {
          padding: 4rem 1.5rem 6rem;
        }
        .cta-card {
          padding: 4rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .cta-glow {
          position: absolute;
          top: -50%;
          left: 50%;
          transform: translateX(-50%);
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(43,141,255,0.1) 0%, transparent 70%);
          filter: blur(60px);
          pointer-events: none;
        }
        .cta-title {
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          font-weight: 800;
          margin-bottom: 1rem;
          position: relative;
        }
        .cta-subtitle {
          font-size: 1.0625rem;
          color: var(--color-text-secondary);
          margin-bottom: 2rem;
          position: relative;
        }

        /* ── Footer ── */
        .landing-footer {
          padding: 4rem 1.5rem 2rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
        .footer-brand-desc {
          font-size: 0.875rem;
          color: var(--color-text-muted);
          margin-top: 0.75rem;
          line-height: 1.6;
        }
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .footer-links h4 {
          font-size: 0.875rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        .footer-links a {
          color: var(--color-text-muted);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s;
        }
        .footer-links a:hover {
          color: var(--color-text-primary);
        }
        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.8125rem;
          color: var(--color-text-muted);
        }
        .footer-disclaimer {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}

/* ── Data ── */
const features = [
  {
    icon: <Video size={24} />,
    iconBg: 'linear-gradient(135deg, rgba(43,141,255,0.2), rgba(43,141,255,0.1))',
    title: 'AI Video Analysis',
    desc: 'Upload your bowling video and get instant AI-powered biomechanical analysis of every phase of your action.',
  },
  {
    icon: <Shield size={24} />,
    iconBg: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.1))',
    title: 'Injury Risk Assessment',
    desc: 'Know your body\'s risk zones before they become injuries. AI-calculated risk scores for lower back, shoulder, and knee.',
  },
  {
    icon: <TrendingUp size={24} />,
    iconBg: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.1))',
    title: 'Pace Leak Detection',
    desc: 'Discover exactly where you\'re losing speed. Get coaching insights like "front knee collapse is costing you 8–12 km/h".',
  },
  {
    icon: <Target size={24} />,
    iconBg: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(249,115,22,0.1))',
    title: 'Personalized Drills',
    desc: 'Auto-generated weekly drill programs tailored to your specific weaknesses. Track progress and stay consistent.',
  },
  {
    icon: <BarChart3 size={24} />,
    iconBg: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.1))',
    title: 'Progress Tracking',
    desc: 'Track your form score, pace, and injury risk over time. Earn badges and maintain streaks.',
  },
  {
    icon: <Users size={24} />,
    iconBg: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(6,182,212,0.1))',
    title: 'Coaching Dashboard',
    desc: 'Coaches can manage squads, compare bowlers, assign drills, and track every player\'s progress in one place.',
  },
];

const steps = [
  {
    icon: <Video size={28} />,
    title: 'Upload Your Video',
    desc: 'Record your bowling action from the side and upload it. Our camera guide shows you exactly how to film it.',
  },
  {
    icon: <Brain size={28} />,
    title: 'AI Analyzes Your Action',
    desc: 'Our AI breaks down every phase — run-up, bound, delivery stride — scoring each out of 10 with detailed insights.',
  },
  {
    icon: <Target size={28} />,
    title: 'Get Your Coaching Plan',
    desc: 'Receive a personalized report with pace leak analysis, injury risk assessment, and targeted drills to improve.',
  },
];

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    desc: 'Try BowlSmart with a free analysis.',
    popular: false,
    cta: 'Start Free',
    features: [
      '1 video analysis',
      'Basic report summary',
      '5 drill recommendations',
      'Community access',
    ],
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    desc: 'For serious bowlers ready to unlock their pace.',
    popular: true,
    cta: 'Go Pro',
    features: [
      'Unlimited video analyses',
      'Full detailed reports & PDF export',
      'Complete drill library',
      'Progress tracker & badges',
      'Pace progression charts',
      'Priority AI processing',
    ],
  },
  {
    name: 'Coach',
    price: '$29',
    period: '/month',
    desc: 'Manage your squad with AI-powered insights.',
    popular: false,
    cta: 'Start Coaching',
    features: [
      'Everything in Pro',
      'Up to 10 bowler profiles',
      'Coaching dashboard',
      'Squad comparison tools',
      'Assign drills to bowlers',
      'Notes & feedback per bowler',
    ],
  },
];
