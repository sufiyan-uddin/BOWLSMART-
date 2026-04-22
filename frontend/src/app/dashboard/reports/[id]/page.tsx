'use client';

import { useState, useEffect, use } from 'react';
import { 
  ArrowLeft, Download, Share2, AlertTriangle, ArrowRight,
  TrendingUp, Shield, Zap, Target, Activity,
  ChevronRight, Brain, CheckCircle2, Clock,
  FileText, ExternalLink, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

/* ═══════════════════════════════════════════════════
   BOWLING REPORT — Full Analysis View
   Handles both mock (static IDs) and live API results
   ═══════════════════════════════════════════════════ */

// Comprehensive mock report data for static IDs
const mockReport = {
  id: '1',
  date: 'March 28, 2026',
  overallScore: 78,
  injuryRisk: 35,
  injuryLevel: 'Moderate',
  estimatedMaxPace: 148,
  currentPace: 132,
  paceEfficiency: 89,

  phases: [
    { name: 'Run-Up', score: 8, status: 'green', summary: 'Great rhythm and acceleration. Last 3 strides show good tempo increase.' },
    { name: 'Bound', score: 7, status: 'green', summary: 'Good gather position. Front arm could drive harder for more momentum transfer.' },
    { name: 'Back-Foot Contact', score: 6, status: 'amber', summary: 'Hip-shoulder separation at 38° — decent. Slightly too chest-on at this stage.' },
    { name: 'Front-Foot Contact', score: 5, status: 'red', summary: 'Front knee collapsing to 142°. This is your biggest pace leak — losing energy transfer.' },
    { name: 'Delivery Stride', score: 8, status: 'green', summary: 'Strong shoulder rotation. Release point is consistent and at good height.' },
    { name: 'Follow-Through', score: 7, status: 'green', summary: 'Balanced follow-through. Good deceleration pattern reduces lower back stress.' },
  ],

  paceLeaks: [
    {
      rank: 1,
      issue: 'Front Knee Collapse',
      description: 'Your front knee is flexing to 142° at front-foot contact instead of staying braced at 160°+. This means your front leg is absorbing energy that should transfer up through your body to the bowling arm.',
      paceImpact: '8–12 km/h',
      fix: 'Practice wall bracing drills. Stand facing a wall with your front foot planted and push your hip through while keeping your knee locked. This builds the habit of a firm front leg.',
    },
    {
      rank: 2,
      issue: 'Early Chest-On Rotation',
      description: 'You\'re opening up too early in your action. Hip-shoulder separation drops to 28° at back-foot contact — ideally you want 35-50° here. This means your torso "uncoils" before you reach the delivery stride.',
      paceImpact: '4–6 km/h',
      fix: 'Use the "delayed rotation drill": run in and focus on keeping your front shoulder pointing at the batsman as long as possible. Let your hips lead the rotation, not your shoulders.',
    },
    {
      rank: 3,
      issue: 'Front Arm Not Driving Down',
      description: 'Your non-bowling arm is splaying out to the side instead of driving down toward your hip. This reduces the "catapult" effect that pulls your bowling shoulder through faster.',
      paceImpact: '3–5 km/h',
      fix: 'Practice bowling with a ball in your front hand — toss it down toward your front hip as you deliver. This trains the front arm pull-down action.',
    },
  ],

  injuryAreas: [
    { area: 'Lower Back', risk: 42, level: 'moderate', reason: 'Moderate lateral trunk flexion (28°). Within acceptable range but worth monitoring, especially with your bowling workload.' },
    { area: 'Front Knee', risk: 55, level: 'high', reason: 'Repeated knee collapse on landing creates stress on the patellar tendon. Strengthen quads and practice bracing technique.' },
    { area: 'Bowling Shoulder', risk: 25, level: 'low', reason: 'Good shoulder mechanics. Release point is consistent and there\'s no excessive counter-rotation.' },
    { area: 'Ankle', risk: 20, level: 'low', reason: 'Front foot landing is controlled. No excessive dorsiflexion or rolling detected.' },
    { area: 'Elbow', risk: 15, level: 'low', reason: 'Bowling arm stays within legal limits. No hyperextension detected during delivery.' },
  ],

  aiSummary: `You've got a really solid foundation — your run-up rhythm is excellent and your delivery stride generates good shoulder rotation. The biggest opportunity to unlock more pace is your front leg. Right now, your front knee is collapsing on landing, which is like trying to catapult a ball with a rubber pole instead of a steel one. Fix that brace, and you could see 8-12 km/h almost immediately.

Your action is predominantly side-on which is great for injury prevention. Keep an eye on your hip-shoulder separation — it's slightly below optimal which means you're not fully using the "coil and uncoil" mechanism that generates free speed without extra effort.

Overall, you're bowling at 89% of your estimated potential. With targeted work on front knee bracing and delayed rotation, 140+ km/h is absolutely within reach.`,

  drillRecommendations: [
    { name: 'Wall Brace Drill', purpose: 'Build front leg strength for firm landing', category: 'Body Mechanics', sets: '3 × 10 reps' },
    { name: 'Delayed Rotation Bowling', purpose: 'Improve hip-shoulder separation timing', category: 'Body Mechanics', sets: '2 × 6 deliveries' },
    { name: 'Front Arm Pull-Down', purpose: 'Train active front arm for faster rotation', category: 'Pace', sets: '3 × 8 reps' },
    { name: 'Single Leg Squats', purpose: 'Strengthen front knee stability', category: 'Strength', sets: '3 × 8 each leg' },
    { name: 'Thoracic Rotation Stretch', purpose: 'Improve trunk rotation range', category: 'Recovery', sets: '2 × 30 seconds each side' },
  ],
};

function transformLiveResult(result: any) {
  /* Transform backend API result shape into our display format */
  const phaseScores = result.phase_scores || {};
  const injRisk = result.injury_risk || {};
  const bio = result.biomechanics || {};
  const aiReport = result.ai_report || {};
  const bp = result.bowler_profile || {};

  const phaseNameMap: Record<string, string> = {
    run_up: 'Run-Up', bound: 'Bound', back_foot_contact: 'Back-Foot Contact',
    front_foot_contact: 'Front-Foot Contact', delivery: 'Delivery Stride', follow_through: 'Follow-Through',
  };

  const phases = Object.entries(phaseScores).map(([key, ps]: [string, any]) => ({
    name: phaseNameMap[key] || key,
    score: ps.score,
    status: ps.status,
    summary: ps.key_metric,
  }));

  const paceLeaks = (result.pace_leaks || []).map((l: any) => ({
    rank: l.rank,
    issue: l.issue,
    description: l.description,
    paceImpact: l.pace_impact_kmh,
    fix: l.fix,
  }));

  const bodyAreaNames: Record<string, string> = {
    lower_back: 'Lower Back', front_knee: 'Front Knee',
    bowling_shoulder: 'Bowling Shoulder', ankle: 'Ankle', elbow: 'Elbow',
  };
  const injuryExplanations = injRisk.explanations || {};
  const injuryAreas = Object.entries(injRisk.body_areas || {}).map(([key, area]: [string, any]) => ({
    area: bodyAreaNames[key] || key,
    risk: area.risk,
    level: area.level,
    reason: injuryExplanations[key] || `Risk score: ${area.risk}/100`,
  }));

  return {
    id: 'live',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    overallScore: result.overall_score || 0,
    injuryRisk: injRisk.overall_risk || 0,
    injuryLevel: injRisk.risk_level || 'Unknown',
    estimatedMaxPace: result.max_pace_potential || 0,
    currentPace: bp.self_reported_pace || 125,
    paceEfficiency: result.overall_score ? Math.round(result.overall_score * 1.1) : 0,
    phases, paceLeaks, injuryAreas,
    aiSummary: aiReport.executive_summary || 'Analysis complete.',
    drillRecommendations: (aiReport.recommended_drills || []).map((d: any) => ({
      name: d.name, purpose: d.purpose, category: d.category || d.target_area, sets: d.sets_reps,
    })),
    aiReport,
  };
}

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Static mock IDs
      if (['1', '2', '3'].includes(id)) {
        setReport(mockReport);
        setLoading(false);
        return;
      }
      // Live result from backend
      try {
        const result = await api.getAnalysisResult(id);
        setReport(transformLiveResult(result));
      } catch (err) {
        console.error('Failed to fetch report, using mock:', err);
        setReport(mockReport);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '1rem' }}>
        <Loader2 size={40} style={{ color: 'var(--color-brand-400)', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--color-text-muted)' }}>Loading your report...</p>
        <style jsx>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <AlertTriangle size={48} style={{ color: '#f97316', marginBottom: '1rem' }} />
        <h2>Report Not Found</h2>
        <Link href="/dashboard/reports" className="btn-secondary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
          <ArrowLeft size={16} /> Back to Reports
        </Link>
      </div>
    );
  }

  const getRiskColor = (risk: number) => risk < 30 ? '#22c55e' : risk < 60 ? '#f97316' : '#ef4444';
  const getStatusColor = (status: string) => status === 'green' ? '#22c55e' : status === 'amber' ? '#f97316' : '#ef4444';

  return (
    <div className="report-page">
      {/* Header */}
      <div className="report-header animate-fade-in-up">
        <Link href="/dashboard/reports" className="back-link">
          <ArrowLeft size={16} />
          Back to Reports
        </Link>
        <div className="report-header-content">
          <div>
            <h1 className="report-title">Bowling Analysis Report</h1>
            <p className="report-date">{report.date}</p>
          </div>
          <div className="report-actions">
            <button className="btn-secondary btn-sm">
              <Share2 size={14} />
              Share
            </button>
            <button className="btn-primary btn-sm">
              <Download size={14} />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Top Score Cards */}
      <div className="score-cards animate-fade-in-up delay-100">
        <div className="main-score-card glass-card-static">
          <div className="main-score-ring">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="58" className="score-ring-track" />
              <circle 
                cx="70" cy="70" r="58"
                className="score-ring-fill"
                stroke="url(#rGrad)"
                strokeDasharray={`${2 * Math.PI * 58 * (report.overallScore / 100)} ${2 * Math.PI * 58}`}
                style={{ filter: 'drop-shadow(0 0 8px rgba(43,141,255,0.4))' }}
              />
              <defs>
                <linearGradient id="rGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2b8dff" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>
            <div className="score-ring-label">
              <span style={{ fontSize: '2.25rem', fontWeight: 900 }}>{report.overallScore}</span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>Form Score</span>
            </div>
          </div>
        </div>

        <div className="score-side-cards">
          <div className="mini-score glass-card-static">
            <Zap size={20} style={{ color: 'var(--color-accent-400)' }} />
            <div>
              <span className="mini-label">Current Pace</span>
              <span className="mini-value">{report.currentPace} km/h</span>
            </div>
          </div>
          <div className="mini-score glass-card-static">
            <Target size={20} style={{ color: '#a78bfa' }} />
            <div>
              <span className="mini-label">Max Potential</span>
              <span className="mini-value">{report.estimatedMaxPace} km/h</span>
            </div>
          </div>
          <div className="mini-score glass-card-static">
            <Activity size={20} style={{ color: 'var(--color-brand-400)' }} />
            <div>
              <span className="mini-label">Pace Efficiency</span>
              <span className="mini-value">{report.paceEfficiency}%</span>
            </div>
          </div>
          <div className="mini-score glass-card-static">
            <Shield size={20} style={{ color: getRiskColor(report.injuryRisk) }} />
            <div>
              <span className="mini-label">Injury Risk</span>
              <span className="mini-value" style={{ color: getRiskColor(report.injuryRisk) }}>{report.injuryRisk}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="glass-card-static report-section animate-fade-in-up delay-200">
        <div className="section-label">
          <Brain size={18} style={{ color: 'var(--color-brand-400)' }} />
          <h2>AI Analysis Summary</h2>
        </div>
        <div className="ai-summary">
          {report.aiSummary.split('\n\n').map((p: string, i: number) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      {/* Phase-by-Phase Breakdown */}
      <div className="glass-card-static report-section animate-fade-in-up delay-300">
        <div className="section-label">
          <Activity size={18} style={{ color: 'var(--color-accent-400)' }} />
          <h2>Phase-by-Phase Breakdown</h2>
        </div>

        {/* Phase Timeline Bar */}
        <div className="phase-timeline" style={{ marginBottom: '1.5rem' }}>
          {report.phases.map((phase: any) => (
            <div 
              key={phase.name}
              className="phase-block"
              style={{ background: `${getStatusColor(phase.status)}15`, border: `1px solid ${getStatusColor(phase.status)}25` }}
            >
              <span style={{ color: getStatusColor(phase.status), fontWeight: 700 }}>{phase.score}/10</span>
              <span>{phase.name}</span>
            </div>
          ))}
        </div>

        {/* Phase Details */}
        <div className="phase-details">
          {report.phases.map((phase: any) => (
            <div key={phase.name} className="phase-detail-card">
              <div className="phase-detail-header">
                <div className="phase-score-badge" style={{ 
                  background: `${getStatusColor(phase.status)}15`,
                  color: getStatusColor(phase.status),
                  border: `1px solid ${getStatusColor(phase.status)}30`
                }}>
                  {phase.score}/10
                </div>
                <h3>{phase.name}</h3>
              </div>
              <p className="phase-detail-text">{phase.summary}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pace Leaks */}
      <div className="glass-card-static report-section animate-fade-in-up delay-400">
        <div className="section-label">
          <TrendingUp size={18} style={{ color: '#ef4444' }} />
          <h2>Pace Leak Analysis</h2>
          <span className="section-tag" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>Top {report.paceLeaks.length} Issues</span>
        </div>

        <div className="pace-leaks">
          {report.paceLeaks.map((leak: any) => (
            <div key={leak.rank} className="pace-leak-card">
              <div className="leak-rank">#{leak.rank}</div>
              <div className="leak-content">
                <div className="leak-header">
                  <h3>{leak.issue}</h3>
                  <span className="badge-red" style={{ fontSize: '0.75rem' }}>
                    <Zap size={12} />
                    -{leak.paceImpact}
                  </span>
                </div>
                <p className="leak-desc">{leak.description}</p>
                <div className="leak-fix">
                  <CheckCircle2 size={14} style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontWeight: 600, color: '#22c55e', fontSize: '0.75rem' }}>HOW TO FIX</span>
                    <p>{leak.fix}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Injury Risk Assessment */}
      <div className="glass-card-static report-section animate-fade-in-up delay-500">
        <div className="section-label">
          <Shield size={18} style={{ color: getRiskColor(report.injuryRisk) }} />
          <h2>Injury Risk Assessment</h2>
          <span className="section-tag" style={{ 
            background: `${getRiskColor(report.injuryRisk)}15`,
            color: getRiskColor(report.injuryRisk)
          }}>
            {report.injuryLevel} Risk
          </span>
        </div>

        <div className="injury-grid">
          {report.injuryAreas.map((area: any) => (
            <div key={area.area} className="injury-card">
              <div className="injury-header">
                <h4>{area.area}</h4>
                <div className="injury-meter">
                  <div className="injury-meter-fill" style={{
                    width: `${area.risk}%`,
                    background: getRiskColor(area.risk)
                  }} />
                </div>
                <span className="injury-score" style={{ color: getRiskColor(area.risk) }}>
                  {area.risk}/100
                </span>
              </div>
              <p className="injury-reason">{area.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Drills */}
      <div className="glass-card-static report-section animate-fade-in-up delay-600">
        <div className="section-label">
          <Target size={18} style={{ color: '#22c55e' }} />
          <h2>Recommended Drills</h2>
        </div>

        <div className="drill-recs">
          {report.drillRecommendations.map((drill: any, i: number) => (
            <div key={i} className="drill-rec-card">
              <div className="drill-rec-info">
                <h4>{drill.name}</h4>
                <p>{drill.purpose}</p>
                <span className="badge-blue" style={{ fontSize: '0.6875rem' }}>{drill.category}</span>
              </div>
              <div className="drill-rec-sets">{drill.sets}</div>
            </div>
          ))}
        </div>

        <Link href="/dashboard/drills" className="btn-primary" style={{ marginTop: '1.5rem' }}>
          Start Drill Program
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Motivational note from AI report */}
      {report.aiReport?.motivational_note && (
        <div className="glass-card-static report-section motivational animate-fade-in-up delay-600">
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, fontStyle: 'italic' }}>
            {report.aiReport.motivational_note}
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="disclaimer" style={{ marginTop: '1.5rem' }}>
        <AlertTriangle size={14} />
        <span>⚠️ This is AI-generated analysis. Consult a qualified cricket coach or physiotherapist for medical decisions.</span>
      </div>

      <style jsx>{`
        .report-page {
          max-width: 900px;
          margin: 0 auto;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          color: var(--color-text-muted);
          text-decoration: none;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          transition: color 0.2s;
        }
        .back-link:hover { color: white; }
        .report-header-content {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .report-title {
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .report-date {
          font-size: 0.875rem;
          color: var(--color-text-muted);
          margin-top: 0.25rem;
        }
        .report-actions {
          display: flex;
          gap: 0.5rem;
        }

        /* Score Cards */
        .score-cards {
          display: flex;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .main-score-card {
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .main-score-ring {
          position: relative;
          width: 140px;
          height: 140px;
        }
        .main-score-ring svg { transform: rotate(-90deg); }
        .main-score-ring .score-ring-label {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .score-side-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          flex: 1;
          min-width: 280px;
        }
        .mini-score {
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .mini-label {
          font-size: 0.6875rem;
          color: var(--color-text-muted);
          display: block;
        }
        .mini-value {
          font-size: 1.25rem;
          font-weight: 800;
          display: block;
        }

        /* Sections */
        .report-section {
          padding: 2rem;
          margin-bottom: 1.25rem;
        }
        .section-label {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          margin-bottom: 1.25rem;
        }
        .section-label h2 {
          font-size: 1.125rem;
          font-weight: 700;
        }
        .section-tag {
          font-size: 0.6875rem;
          font-weight: 600;
          padding: 0.125rem 0.625rem;
          border-radius: 999px;
        }

        /* AI Summary */
        .ai-summary {
          font-size: 0.9375rem;
          line-height: 1.8;
          color: var(--color-text-secondary);
        }
        .ai-summary p {
          margin-bottom: 1rem;
        }
        .ai-summary p:last-child { margin-bottom: 0; }

        /* Phase Details */
        .phase-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .phase-detail-card {
          padding: 1rem;
          background: rgba(255,255,255,0.02);
          border-radius: var(--radius-md);
          border: 1px solid rgba(255,255,255,0.04);
        }
        .phase-detail-header {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          margin-bottom: 0.5rem;
        }
        .phase-score-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.125rem 0.5rem;
          border-radius: 6px;
        }
        .phase-detail-header h3 {
          font-size: 0.9375rem;
          font-weight: 600;
        }
        .phase-detail-text {
          font-size: 0.8125rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        /* Pace Leaks */
        .pace-leaks {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .pace-leak-card {
          display: flex;
          gap: 1rem;
          padding: 1.25rem;
          background: rgba(255,255,255,0.02);
          border-radius: var(--radius-lg);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .leak-rank {
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--color-text-muted);
          opacity: 0.3;
          flex-shrink: 0;
          width: 40px;
        }
        .leak-content { flex: 1; }
        .leak-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }
        .leak-header h3 {
          font-size: 1rem;
          font-weight: 700;
        }
        .leak-desc {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        .leak-fix {
          display: flex;
          gap: 0.625rem;
          padding: 0.75rem 1rem;
          background: rgba(34,197,94,0.05);
          border: 1px solid rgba(34,197,94,0.1);
          border-radius: var(--radius-md);
        }
        .leak-fix p {
          font-size: 0.8125rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
          margin-top: 0.125rem;
        }

        /* Injury Grid */
        .injury-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .injury-card {
          padding: 1rem;
          background: rgba(255,255,255,0.02);
          border-radius: var(--radius-md);
          border: 1px solid rgba(255,255,255,0.04);
        }
        .injury-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .injury-header h4 {
          font-size: 0.875rem;
          font-weight: 600;
          min-width: 120px;
        }
        .injury-meter {
          flex: 1;
          height: 6px;
          border-radius: 3px;
          background: rgba(255,255,255,0.06);
          overflow: hidden;
        }
        .injury-meter-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 1s ease;
        }
        .injury-score {
          font-size: 0.8125rem;
          font-weight: 700;
          min-width: 50px;
          text-align: right;
        }
        .injury-reason {
          font-size: 0.8125rem;
          color: var(--color-text-muted);
          line-height: 1.5;
          padding-left: calc(120px + 0.75rem);
        }

        /* Drill Recs */
        .drill-recs {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }
        .drill-rec-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255,255,255,0.02);
          border-radius: var(--radius-md);
          border: 1px solid rgba(255,255,255,0.04);
        }
        .drill-rec-info h4 {
          font-size: 0.9375rem;
          font-weight: 600;
          margin-bottom: 0.125rem;
        }
        .drill-rec-info p {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-bottom: 0.375rem;
        }
        .drill-rec-sets {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          white-space: nowrap;
        }

        /* Motivational */
        .motivational {
          background: linear-gradient(135deg, rgba(234,179,8,0.05), rgba(249,115,22,0.03)) !important;
          border-color: rgba(234,179,8,0.12) !important;
        }

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
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .score-cards { flex-direction: column; }
          .phase-details { grid-template-columns: 1fr; }
          .injury-reason { padding-left: 0; }
          .pace-leak-card { flex-direction: column; }
          .leak-rank { width: auto; }
        }
      `}</style>
    </div>
  );
}
