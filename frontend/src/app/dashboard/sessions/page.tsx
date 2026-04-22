'use client';

import { useState } from 'react';
import { Calendar, Clock, Zap, Plus, ChevronDown, Activity } from 'lucide-react';

const sessions = [
  { id: '1', date: '2026-03-28', type: 'Analysis', overs: 6, avgPace: 132, maxPace: 136, fatigue: 4, notes: 'Felt good. Focused on front knee bracing.' },
  { id: '2', date: '2026-03-25', type: 'Training', overs: 8, avgPace: 128, maxPace: 131, fatigue: 6, notes: 'Long session. Legs felt heavy by end.' },
  { id: '3', date: '2026-03-22', type: 'Match', overs: 10, avgPace: 130, maxPace: 134, fatigue: 7, notes: 'Picked up 3 wickets. Pace dropped after 7th over.' },
  { id: '4', date: '2026-03-21', type: 'Analysis', overs: 4, avgPace: 128, maxPace: 131, fatigue: 3, notes: 'Quick analysis session.' },
  { id: '5', date: '2026-03-18', type: 'Training', overs: 6, avgPace: 126, maxPace: 129, fatigue: 5, notes: 'Worked on run-up rhythm.' },
];

export default function SessionsPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Analysis': return 'var(--color-brand-400)';
      case 'Match': return '#f97316';
      case 'Training': return '#22c55e';
      default: return 'var(--color-text-muted)';
    }
  };

  return (
    <div className="sessions-page">
      <div className="page-header animate-fade-in-up">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Bowling Sessions</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
            Log and track your bowling workload.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} /> Log Session
        </button>
      </div>

      {/* Add Session Form */}
      {showAddForm && (
        <div className="glass-card-static add-form animate-scale-in">
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Log New Session</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="input-label">Date</label>
              <input className="input-field" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="form-group">
              <label className="input-label">Session Type</label>
              <select className="select-field">
                <option>Training</option>
                <option>Match</option>
                <option>Analysis</option>
              </select>
            </div>
            <div className="form-group">
              <label className="input-label">Overs Bowled</label>
              <input className="input-field" type="number" placeholder="e.g. 6" />
            </div>
            <div className="form-group">
              <label className="input-label">Avg Pace (km/h)</label>
              <input className="input-field" type="number" placeholder="e.g. 130" />
            </div>
            <div className="form-group">
              <label className="input-label">Max Pace (km/h)</label>
              <input className="input-field" type="number" placeholder="e.g. 135" />
            </div>
            <div className="form-group">
              <label className="input-label">Fatigue (1-10)</label>
              <input className="input-field" type="number" min="1" max="10" placeholder="e.g. 5" />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label className="input-label">Notes</label>
            <textarea className="input-field" rows={2} placeholder="How did the session feel?" style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button className="btn-secondary btn-sm" onClick={() => setShowAddForm(false)}>Cancel</button>
            <button className="btn-primary btn-sm" onClick={() => setShowAddForm(false)}>Save Session</button>
          </div>
        </div>
      )}

      {/* Sessions List */}
      <div className="sessions-list animate-fade-in-up delay-100">
        {sessions.map(session => (
          <div key={session.id} className="session-card glass-card-static">
            <div className="session-header">
              <div className="session-date">
                <Calendar size={14} style={{ color: 'var(--color-text-muted)' }} />
                {new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <span className="session-type" style={{ color: getTypeColor(session.type), background: `${getTypeColor(session.type)}15`, padding: '0.125rem 0.5rem', borderRadius: '999px', fontSize: '0.6875rem', fontWeight: 600 }}>
                {session.type}
              </span>
            </div>

            <div className="session-stats">
              <div className="session-stat">
                <Activity size={14} />
                <span>{session.overs} overs</span>
              </div>
              <div className="session-stat">
                <Zap size={14} style={{ color: '#f97316' }} />
                <span>{session.avgPace} avg / <strong>{session.maxPace}</strong> max km/h</span>
              </div>
              <div className="session-stat">
                <Clock size={14} />
                <span>Fatigue: {session.fatigue}/10</span>
              </div>
            </div>

            {session.notes && (
              <p className="session-notes">{session.notes}</p>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .sessions-page { max-width: 800px; margin: 0 auto; }
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
        .add-form { padding: 1.5rem; margin-bottom: 1.5rem; }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        .form-group { margin-bottom: 0; }
        .sessions-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .session-card { padding: 1.25rem; }
        .session-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
        .session-date { display: flex; align-items: center; gap: 0.375rem; font-size: 0.875rem; font-weight: 600; }
        .session-stats { display: flex; gap: 1.5rem; flex-wrap: wrap; }
        .session-stat { display: flex; align-items: center; gap: 0.375rem; font-size: 0.8125rem; color: var(--color-text-secondary); }
        .session-stat strong { color: var(--color-text-primary); }
        .session-notes { font-size: 0.8125rem; color: var(--color-text-muted); margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.05); font-style: italic; }
        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}
