'use client';

import Link from 'next/link';
import { FileText, ChevronRight, Calendar, Activity, Zap, Shield } from 'lucide-react';

const reports = [
  { id: '1', date: 'March 28, 2026', formScore: 78, pace: 132, injuryRisk: 35, riskLevel: 'Moderate' },
  { id: '2', date: 'March 21, 2026', formScore: 72, pace: 128, injuryRisk: 42, riskLevel: 'Moderate' },
  { id: '3', date: 'March 14, 2026', formScore: 68, pace: 125, injuryRisk: 48, riskLevel: 'Moderate' },
];

export default function ReportsListPage() {
  const getRiskColor = (risk: number) => risk < 30 ? '#22c55e' : risk < 60 ? '#f97316' : '#ef4444';

  return (
    <div className="reports-list-page">
      <div className="page-header animate-fade-in-up">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Reports</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
          View all your bowling analysis reports.
        </p>
      </div>

      <div className="reports-grid animate-fade-in-up delay-100">
        {reports.map((r) => (
          <Link href={`/dashboard/reports/${r.id}`} key={r.id} className="report-card glass-card">
            <div className="report-card-header">
              <div className="report-card-icon">
                <FileText size={20} />
              </div>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Analysis Report</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Calendar size={12} /> {r.date}
                </p>
              </div>
              <ChevronRight size={18} style={{ color: 'var(--color-text-muted)', marginLeft: 'auto' }} />
            </div>

            <div className="report-card-stats">
              <div className="report-stat">
                <Activity size={14} style={{ color: 'var(--color-brand-400)' }} />
                <span className="report-stat-label">Form</span>
                <span className="report-stat-value">{r.formScore}/100</span>
              </div>
              <div className="report-stat">
                <Zap size={14} style={{ color: 'var(--color-accent-400)' }} />
                <span className="report-stat-label">Pace</span>
                <span className="report-stat-value">{r.pace} km/h</span>
              </div>
              <div className="report-stat">
                <Shield size={14} style={{ color: getRiskColor(r.injuryRisk) }} />
                <span className="report-stat-label">Risk</span>
                <span className="report-stat-value" style={{ color: getRiskColor(r.injuryRisk) }}>{r.injuryRisk}/100</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .reports-list-page { max-width: 800px; margin: 0 auto; }
        .page-header { margin-bottom: 2rem; }
        .reports-grid { display: flex; flex-direction: column; gap: 1rem; }
        .report-card { padding: 1.5rem; text-decoration: none; color: inherit; display: block; }
        .report-card-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
        .report-card-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: rgba(43,141,255,0.12); color: var(--color-brand-400);
          display: flex; align-items: center; justify-content: center;
        }
        .report-card-stats { display: flex; gap: 1.5rem; }
        .report-stat {
          display: flex; align-items: center; gap: 0.375rem;
          font-size: 0.875rem;
        }
        .report-stat-label { color: var(--color-text-muted); font-size: 0.75rem; }
        .report-stat-value { font-weight: 700; }
      `}</style>
    </div>
  );
}
