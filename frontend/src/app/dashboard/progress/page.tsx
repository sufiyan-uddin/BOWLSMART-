'use client';

import { 
  TrendingUp, Zap, Shield, Activity, Award,
  Flame, Calendar, Target, CheckCircle2, Lock
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid
} from 'recharts';

/* ═══════════════════════════════════════════════════
   PROGRESS TRACKER
   ═══════════════════════════════════════════════════ */

const progressData = [
  { date: 'Jan', formScore: 58, pace: 120, injuryRisk: 55 },
  { date: 'Feb', formScore: 63, pace: 123, injuryRisk: 50 },
  { date: 'Mar 1', formScore: 68, pace: 125, injuryRisk: 48 },
  { date: 'Mar 14', formScore: 72, pace: 128, injuryRisk: 42 },
  { date: 'Mar 21', formScore: 72, pace: 128, injuryRisk: 42 },
  { date: 'Mar 28', formScore: 78, pace: 132, injuryRisk: 35 },
];

const badges = [
  { name: 'First Analysis', icon: '🎯', desc: 'Complete your first bowling analysis', earned: true, date: 'Jan 15' },
  { name: '7-Day Streak', icon: '🔥', desc: 'Train for 7 consecutive days', earned: true, date: 'Feb 8' },
  { name: 'Broke 130 km/h', icon: '⚡', desc: 'Record a pace above 130 km/h', earned: true, date: 'Mar 28' },
  { name: 'Form Score 80+', icon: '🏆', desc: 'Achieve a form score of 80 or above', earned: false, date: null },
  { name: '30-Day Streak', icon: '💎', desc: 'Train for 30 consecutive days', earned: false, date: null },
  { name: 'Risk Reduced 20%', icon: '🛡️', desc: 'Reduce your injury risk by 20 points', earned: true, date: 'Mar 21' },
  { name: 'Speed Demon', icon: '🚀', desc: 'Record 140+ km/h pace', earned: false, date: null },
  { name: '100 Drills', icon: '💪', desc: 'Complete 100 drill sessions', earned: false, date: null },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; color: string; name: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(17,24,39,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        padding: '0.75rem 1rem',
        backdropFilter: 'blur(10px)',
      }}>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.375rem' }}>{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ fontSize: '0.8125rem', fontWeight: 600, color: entry.color }}>
            {entry.name}: {entry.value}{entry.name === 'Pace' ? ' km/h' : entry.name === 'Injury Risk' ? '/100' : '/100'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ProgressPage() {
  return (
    <div className="progress-page">
      <div className="page-header animate-fade-in-up">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Progress Tracker</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
          Track your bowling improvements over time.
        </p>
      </div>

      {/* Streak & Quick Stats */}
      <div className="streak-bar glass-card-static animate-fade-in-up delay-100">
        <div className="streak-item">
          <Flame size={24} style={{ color: '#f97316' }} />
          <div>
            <span className="streak-value">12</span>
            <span className="streak-label">Day Streak</span>
          </div>
        </div>
        <div className="streak-divider" />
        <div className="streak-item">
          <Calendar size={24} style={{ color: 'var(--color-brand-400)' }} />
          <div>
            <span className="streak-value">3</span>
            <span className="streak-label">Analyses</span>
          </div>
        </div>
        <div className="streak-divider" />
        <div className="streak-item">
          <CheckCircle2 size={24} style={{ color: '#22c55e' }} />
          <div>
            <span className="streak-value">18</span>
            <span className="streak-label">Drills Done</span>
          </div>
        </div>
        <div className="streak-divider" />
        <div className="streak-item">
          <Award size={24} style={{ color: '#eab308' }} />
          <div>
            <span className="streak-value">4</span>
            <span className="streak-label">Badges</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid animate-fade-in-up delay-200">
        {/* Form Score Chart */}
        <div className="glass-card-static chart-card">
          <div className="chart-header">
            <div className="chart-label">
              <Activity size={16} style={{ color: 'var(--color-brand-400)' }} />
              <h3>Form Score</h3>
            </div>
            <div className="chart-change up">
              <TrendingUp size={14} />
              +20 pts
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="gradForm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2b8dff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2b8dff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="formScore" name="Form Score" stroke="#2b8dff" fill="url(#gradForm)" strokeWidth={2.5} dot={{ fill: '#2b8dff', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pace Chart */}
        <div className="glass-card-static chart-card">
          <div className="chart-header">
            <div className="chart-label">
              <Zap size={16} style={{ color: 'var(--color-accent-400)' }} />
              <h3>Pace Progression</h3>
            </div>
            <div className="chart-change up">
              <TrendingUp size={14} />
              +12 km/h
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="gradPace" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[110, 150]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="pace" name="Pace" stroke="#f97316" fill="url(#gradPace)" strokeWidth={2.5} dot={{ fill: '#f97316', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Injury Risk Chart */}
        <div className="glass-card-static chart-card" style={{ gridColumn: 'span 2' }}>
          <div className="chart-header">
            <div className="chart-label">
              <Shield size={16} style={{ color: '#22c55e' }} />
              <h3>Injury Risk Trend</h3>
            </div>
            <div className="chart-change down">
              <TrendingUp size={14} style={{ transform: 'rotate(180deg)' }} />
              -20 pts (safer!)
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="gradRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} reversed />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="injuryRisk" name="Injury Risk" stroke="#22c55e" fill="url(#gradRisk)" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="glass-card-static badges-section animate-fade-in-up delay-300">
        <div className="section-header-row">
          <h3 style={{ fontWeight: 700 }}>
            <Award size={18} style={{ color: '#eab308', marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Badges & Milestones
          </h3>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
            {badges.filter(b => b.earned).length}/{badges.length} earned
          </span>
        </div>

        <div className="badges-grid">
          {badges.map((badge, i) => (
            <div key={i} className={`badge-card ${badge.earned ? 'earned' : 'locked'}`}>
              <span className="badge-emoji">{badge.icon}</span>
              <div>
                <h4 className="badge-title">{badge.name}</h4>
                <p className="badge-desc">{badge.desc}</p>
                {badge.earned && badge.date && (
                  <span className="badge-date">Earned {badge.date}</span>
                )}
                {!badge.earned && (
                  <span className="badge-locked"><Lock size={10} /> Locked</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .progress-page { max-width: 1000px; margin: 0 auto; }
        .page-header { margin-bottom: 1.5rem; }

        /* Streak Bar */
        .streak-bar {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .streak-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .streak-value {
          font-size: 1.5rem;
          font-weight: 800;
          display: block;
        }
        .streak-label {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          display: block;
        }
        .streak-divider {
          width: 1px;
          height: 40px;
          background: rgba(255,255,255,0.08);
        }

        /* Charts */
        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .chart-card {
          padding: 1.5rem;
        }
        .chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .chart-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .chart-label h3 {
          font-size: 0.9375rem;
          font-weight: 700;
        }
        .chart-change {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.125rem 0.5rem;
          border-radius: 999px;
        }
        .chart-change.up {
          color: #22c55e;
          background: rgba(34,197,94,0.1);
        }
        .chart-change.down {
          color: #22c55e;
          background: rgba(34,197,94,0.1);
        }
        .chart-container {
          margin: 0 -0.5rem;
        }

        /* Badges */
        .badges-section {
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        .section-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .badges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 0.75rem;
        }
        .badge-card {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          background: rgba(255,255,255,0.02);
          border-radius: var(--radius-md);
          border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.2s;
        }
        .badge-card.locked {
          opacity: 0.4;
        }
        .badge-card.earned {
          border-color: rgba(234,179,8,0.15);
          background: rgba(234,179,8,0.03);
        }
        .badge-emoji {
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        .badge-title {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.125rem;
        }
        .badge-desc {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          line-height: 1.4;
        }
        .badge-date {
          font-size: 0.6875rem;
          color: var(--color-success-400);
          margin-top: 0.25rem;
          display: block;
        }
        .badge-locked {
          font-size: 0.6875rem;
          color: var(--color-text-muted);
          margin-top: 0.25rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        @media (max-width: 768px) {
          .charts-grid { grid-template-columns: 1fr; }
          .charts-grid > *:last-child { grid-column: span 1; }
          .streak-bar { justify-content: flex-start; }
          .streak-divider { display: none; }
        }
      `}</style>
    </div>
  );
}
