'use client';

import { 
  TrendingUp, Zap, Shield, Target, Video, ArrowRight,
  Calendar, Award, Flame, ChevronRight, Activity,
  Clock, BarChart3, AlertTriangle, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

/* ═══════════════════════════════════════════════════
   DASHBOARD — Home Screen
   ═══════════════════════════════════════════════════ */

// Mock data - in production, fetched from Supabase
const mockData = {
  bowlerName: 'Bowler',
  formScore: 78,
  paceKmh: 132,
  injuryRisk: 35,
  injuryLevel: 'Moderate' as const,
  maxPacePotential: 148,
  streak: 12,
  sessionsThisWeek: 3,
  drillsCompleted: 18,
  recentAnalyses: [
    { id: '1', date: 'Mar 28', score: 78, pace: 132, status: 'complete' },
    { id: '2', date: 'Mar 21', score: 72, pace: 128, status: 'complete' },
    { id: '3', date: 'Mar 14', score: 68, pace: 125, status: 'complete' },
  ],
  badges: [
    { name: 'First Analysis', icon: '🎯', earned: true },
    { name: '7-Day Streak', icon: '🔥', earned: true },
    { name: '130+ km/h', icon: '⚡', earned: true },
    { name: '30-Day Streak', icon: '💎', earned: false },
  ],
  upcomingDrills: [
    { name: 'Front Leg Bracing Drill', category: 'Body Mechanics', done: false },
    { name: 'Run-Up Rhythm Builder', category: 'Pace', done: true },
    { name: 'Shoulder Rotation Stretch', category: 'Recovery', done: false },
  ],
};

export default function DashboardPage() {
  const riskColor = mockData.injuryRisk < 30 ? '#22c55e' : mockData.injuryRisk < 60 ? '#f97316' : '#ef4444';

  return (
    <div className="dashboard">
      {/* Greeting */}
      <div className="dashboard-greeting animate-fade-in-up">
        <div>
          <h1 className="greeting-title">
            Welcome back<span className="gradient-text">{mockData.bowlerName ? `, ${mockData.bowlerName}` : ''}</span> 🏏
          </h1>
          <p className="greeting-subtitle">Here&apos;s your bowling performance overview.</p>
        </div>
        <Link href="/dashboard/analyze" className="btn-primary">
          <Video size={18} />
          New Analysis
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid animate-fade-in-up delay-100">
        <div className="kpi-card glass-card-static">
          <div className="kpi-icon" style={{ background: 'rgba(43,141,255,0.15)', color: 'var(--color-brand-400)' }}>
            <Activity size={20} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Form Score</span>
            <span className="kpi-value">{mockData.formScore}<span className="kpi-unit">/100</span></span>
          </div>
          <div className="kpi-trend up">
            <TrendingUp size={14} />
            +6
          </div>
        </div>

        <div className="kpi-card glass-card-static">
          <div className="kpi-icon" style={{ background: 'rgba(249,115,22,0.15)', color: 'var(--color-accent-400)' }}>
            <Zap size={20} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Current Pace</span>
            <span className="kpi-value">{mockData.paceKmh}<span className="kpi-unit"> km/h</span></span>
          </div>
          <div className="kpi-trend up">
            <TrendingUp size={14} />
            +4
          </div>
        </div>

        <div className="kpi-card glass-card-static">
          <div className="kpi-icon" style={{ background: `${riskColor}22`, color: riskColor }}>
            <Shield size={20} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Injury Risk</span>
            <span className="kpi-value" style={{ color: riskColor }}>{mockData.injuryRisk}<span className="kpi-unit">/100</span></span>
          </div>
          <div className="badge-amber" style={{ fontSize: '0.6875rem', padding: '0.125rem 0.5rem' }}>
            {mockData.injuryLevel}
          </div>
        </div>

        <div className="kpi-card glass-card-static">
          <div className="kpi-icon" style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}>
            <Target size={20} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Pace Potential</span>
            <span className="kpi-value">{mockData.maxPacePotential}<span className="kpi-unit"> km/h</span></span>
          </div>
          <div className="kpi-trend" style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
            Estimated max
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid animate-fade-in-up delay-200">
        {/* Form Score Ring + Quick Stats */}
        <div className="glass-card-static" style={{ padding: '1.5rem', gridColumn: 'span 2' }}>
          <h3 className="card-title">Performance Overview</h3>
          <div className="performance-overview">
            <div className="form-score-ring">
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="68" className="score-ring-track" />
                <circle 
                  cx="80" cy="80" r="68"
                  className="score-ring-fill"
                  stroke="url(#dashGrad)"
                  strokeDasharray={`${2 * Math.PI * 68 * (mockData.formScore / 100)} ${2 * Math.PI * 68}`}
                  style={{ filter: 'drop-shadow(0 0 6px rgba(43,141,255,0.4))' }}
                />
                <defs>
                  <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2b8dff" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="score-ring-label">
                <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>{mockData.formScore}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Form Score</span>
              </div>
            </div>

            <div className="quick-stats">
              <div className="quick-stat">
                <Flame size={18} style={{ color: '#f97316' }} />
                <div>
                  <span className="quick-stat-value">{mockData.streak} days</span>
                  <span className="quick-stat-label">Current Streak</span>
                </div>
              </div>
              <div className="quick-stat">
                <Calendar size={18} style={{ color: 'var(--color-brand-400)' }} />
                <div>
                  <span className="quick-stat-value">{mockData.sessionsThisWeek}</span>
                  <span className="quick-stat-label">Sessions This Week</span>
                </div>
              </div>
              <div className="quick-stat">
                <CheckCircle2 size={18} style={{ color: '#22c55e' }} />
                <div>
                  <span className="quick-stat-value">{mockData.drillsCompleted}</span>
                  <span className="quick-stat-label">Drills Completed</span>
                </div>
              </div>
              <div className="quick-stat">
                <BarChart3 size={18} style={{ color: '#a78bfa' }} />
                <div>
                  <span className="quick-stat-value">{mockData.recentAnalyses.length}</span>
                  <span className="quick-stat-label">Total Analyses</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Drills */}
        <div className="glass-card-static" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className="card-title" style={{ margin: 0 }}>Today&apos;s Drills</h3>
            <Link href="/dashboard/drills" style={{ color: 'var(--color-brand-400)', fontSize: '0.8125rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="drill-list">
            {mockData.upcomingDrills.map((drill, i) => (
              <div key={i} className="drill-list-item">
                <div className={`drill-check ${drill.done ? 'done' : ''}`}>
                  {drill.done && <CheckCircle2 size={14} />}
                </div>
                <div>
                  <div className="drill-name" style={{ textDecoration: drill.done ? 'line-through' : 'none', opacity: drill.done ? 0.5 : 1 }}>{drill.name}</div>
                  <div className="drill-category">{drill.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="glass-card-static" style={{ padding: '1.5rem', gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className="card-title" style={{ margin: 0 }}>Recent Analyses</h3>
            <Link href="/dashboard/reports" style={{ color: 'var(--color-brand-400)', fontSize: '0.8125rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="analyses-table">
            <div className="table-header">
              <span>Date</span>
              <span>Form Score</span>
              <span>Pace</span>
              <span>Status</span>
              <span></span>
            </div>
            {mockData.recentAnalyses.map(a => (
              <Link href={`/dashboard/reports/${a.id}`} key={a.id} className="table-row">
                <span>{a.date}</span>
                <span style={{ fontWeight: 600 }}>{a.score}/100</span>
                <span>{a.pace} km/h</span>
                <span className="badge-green" style={{ fontSize: '0.6875rem', padding: '0.125rem 0.5rem' }}>Complete</span>
                <span><ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} /></span>
              </Link>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="glass-card-static" style={{ padding: '1.5rem' }}>
          <h3 className="card-title">Badges</h3>
          <div className="badges-grid">
            {mockData.badges.map((badge, i) => (
              <div key={i} className={`badge-item ${badge.earned ? '' : 'locked'}`}>
                <span className="badge-icon">{badge.icon}</span>
                <span className="badge-name">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="disclaimer animate-fade-in-up delay-300">
        <AlertTriangle size={14} />
        <span>AI-generated analysis. Consult a qualified cricket coach or physiotherapist for medical decisions.</span>
      </div>

      <style jsx>{`
        .dashboard {
          max-width: 1200px;
          margin: 0 auto;
        }
        .dashboard-greeting {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .greeting-title {
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .greeting-subtitle {
          font-size: 0.9375rem;
          color: var(--color-text-secondary);
          margin-top: 0.25rem;
        }

        /* KPI Grid */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .kpi-card {
          padding: 1.25rem;
          display: flex;
          align-items: flex-start;
          gap: 0.875rem;
          position: relative;
        }
        .kpi-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .kpi-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .kpi-label {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }
        .kpi-value {
          font-size: 1.5rem;
          font-weight: 800;
        }
        .kpi-unit {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-muted);
        }
        .kpi-trend {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.125rem 0.5rem;
          border-radius: 999px;
        }
        .kpi-trend.up {
          color: #22c55e;
          background: rgba(34,197,94,0.1);
        }

        /* Dashboard Grid */
        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .card-title {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        /* Performance Overview */
        .performance-overview {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          flex-wrap: wrap;
        }
        .form-score-ring {
          position: relative;
          width: 160px;
          height: 160px;
          flex-shrink: 0;
        }
        .form-score-ring svg {
          transform: rotate(-90deg);
        }
        .form-score-ring .score-ring-label {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .quick-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          flex: 1;
        }
        .quick-stat {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          background: rgba(255,255,255,0.03);
          border-radius: var(--radius-lg);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .quick-stat-value {
          font-size: 1.125rem;
          font-weight: 700;
          display: block;
        }
        .quick-stat-label {
          font-size: 0.6875rem;
          color: var(--color-text-muted);
          display: block;
        }

        /* Drill List */
        .drill-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .drill-list-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255,255,255,0.02);
          border-radius: var(--radius-md);
          border: 1px solid rgba(255,255,255,0.04);
        }
        .drill-check {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          border: 2px solid rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: transparent;
        }
        .drill-check.done {
          background: rgba(34,197,94,0.15);
          border-color: #22c55e;
          color: #22c55e;
        }
        .drill-name {
          font-size: 0.875rem;
          font-weight: 600;
        }
        .drill-category {
          font-size: 0.6875rem;
          color: var(--color-text-muted);
        }

        /* Table */
        .analyses-table {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .table-header {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr 40px;
          gap: 1rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.6875rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        .table-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr 40px;
          gap: 1rem;
          padding: 0.75rem;
          font-size: 0.875rem;
          border-radius: var(--radius-md);
          transition: background 0.2s;
          text-decoration: none;
          color: var(--color-text-primary);
          align-items: center;
        }
        .table-row:hover {
          background: rgba(255,255,255,0.03);
        }

        /* Badges */
        .badges-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.625rem;
        }
        .badge-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: rgba(255,255,255,0.03);
          border-radius: var(--radius-md);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .badge-item.locked {
          opacity: 0.35;
        }
        .badge-icon {
          font-size: 1.25rem;
        }
        .badge-name {
          font-size: 0.75rem;
          font-weight: 600;
        }

        /* Disclaimer */
        .disclaimer {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(249,115,22,0.06);
          border: 1px solid rgba(249,115,22,0.1);
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }

        @media (max-width: 1024px) {
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          .dashboard-grid > *:first-child {
            grid-column: span 1;
          }
          .dashboard-grid > *:nth-child(3) {
            grid-column: span 1;
          }
        }
        @media (max-width: 640px) {
          .kpi-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
