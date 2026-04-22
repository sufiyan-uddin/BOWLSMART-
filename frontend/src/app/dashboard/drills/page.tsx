'use client';

import { useState } from 'react';
import { 
  Target, CheckCircle2, Clock, Play, Star,
  Filter, ChevronDown, Zap, Shield, RotateCcw,
  Dumbbell, Heart
} from 'lucide-react';

/* ═══════════════════════════════════════════════════
   DRILLS — Library & Weekly Program
   ═══════════════════════════════════════════════════ */

const categories = ['All', 'Pace', 'Body Mechanics', 'Strength', 'Recovery', 'Run-Up'];

const drills = [
  {
    id: '1', name: 'Wall Brace Drill', category: 'Body Mechanics', difficulty: 'Beginner',
    purpose: 'Build front leg strength and bracing habit for firm landing at front-foot contact.',
    sets: '3 × 10 reps', targetArea: 'Front Knee',
    cues: ['Keep front knee locked as you push hip through', 'Drive off back foot toward the wall', 'Feel the brace in your quad'],
    isPremium: false, isFavorite: true,
  },
  {
    id: '2', name: 'Delayed Rotation Bowling', category: 'Body Mechanics', difficulty: 'Intermediate',
    purpose: 'Improve hip-shoulder separation timing to maximize torque generation in the delivery stride.',
    sets: '2 × 6 deliveries', targetArea: 'Hip-Shoulder Separation',
    cues: ['Keep front shoulder pointing at the batsman', 'Let hips lead the rotation', 'Feel the stretch in your core'],
    isPremium: false, isFavorite: false,
  },
  {
    id: '3', name: 'Front Arm Pull-Down', category: 'Pace', difficulty: 'Beginner',
    purpose: 'Train active front arm drive for faster shoulder rotation and bowling arm speed.',
    sets: '3 × 8 reps', targetArea: 'Front Arm',
    cues: ['Pull front hand toward your front hip pocket', 'Keep the motion sharp and fast', 'Feel the pull in your bowling shoulder'],
    isPremium: false, isFavorite: false,
  },
  {
    id: '4', name: 'Single Leg Squats', category: 'Strength', difficulty: 'Intermediate',
    purpose: 'Strengthen front knee stability to prevent collapse during delivery.',
    sets: '3 × 8 each leg', targetArea: 'Front Knee',
    cues: ['Control the descent slowly', 'Keep knee tracking over toes', 'Drive up powerfully'],
    isPremium: false, isFavorite: true,
  },
  {
    id: '5', name: 'Thoracic Rotation Stretch', category: 'Recovery', difficulty: 'Beginner',
    purpose: 'Improve trunk rotation range of motion and reduce stress on the lower back.',
    sets: '2 × 30s each side', targetArea: 'Lower Back',
    cues: ['Keep hips still while rotating upper body', 'Breathe deeply into the stretch', 'Hold at end range without forcing'],
    isPremium: false, isFavorite: false,
  },
  {
    id: '6', name: 'Run-Up Rhythm Builder', category: 'Run-Up', difficulty: 'Beginner',
    purpose: 'Develop consistent run-up acceleration and stride rhythm for optimal momentum at the crease.',
    sets: '5 × full run-ups', targetArea: 'Run-Up',
    cues: ['Start slow and build speed', 'Last 3 strides should be fastest', 'Hit the crease in balance'],
    isPremium: false, isFavorite: false,
  },
  {
    id: '7', name: 'Medicine Ball Rotation Throw', category: 'Strength', difficulty: 'Advanced',
    purpose: 'Build rotational power through the core for faster hip-shoulder separation.',
    sets: '3 × 10 each side', targetArea: 'Core',
    cues: ['Rotate from hips, not arms', 'Release with explosive power', 'Keep feet grounded'],
    isPremium: true, isFavorite: false,
  },
  {
    id: '8', name: 'Yoga Flow for Bowlers', category: 'Recovery', difficulty: 'Beginner',
    purpose: 'Full body mobility routine targeting areas stressed during fast bowling.',
    sets: '15 minutes', targetArea: 'Full Body',
    cues: ['Focus on breathing', 'Hold each pose for 5 breaths', 'Move slowly and controlled'],
    isPremium: true, isFavorite: false,
  },
];

const weeklyProgram = [
  { day: 'Monday', drills: ['Wall Brace Drill', 'Single Leg Squats', 'Thoracic Rotation Stretch'], done: [true, true, false] },
  { day: 'Tuesday', drills: ['Run-Up Rhythm Builder', 'Delayed Rotation Bowling'], done: [true, false] },
  { day: 'Wednesday', drills: ['Rest / Yoga Flow'], done: [false] },
  { day: 'Thursday', drills: ['Front Arm Pull-Down', 'Medicine Ball Rotation Throw'], done: [false, false] },
  { day: 'Friday', drills: ['Wall Brace Drill', 'Delayed Rotation Bowling', 'Run-Up Rhythm Builder'], done: [false, false, false] },
  { day: 'Saturday', drills: ['Match Day / Full Bowling Session'], done: [false] },
  { day: 'Sunday', drills: ['Recovery — Stretching & Rest'], done: [false] },
];

export default function DrillsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [view, setView] = useState<'library' | 'program'>('program');
  const [expandedDrill, setExpandedDrill] = useState<string | null>(null);

  const filteredDrills = activeCategory === 'All' 
    ? drills 
    : drills.filter(d => d.category === activeCategory);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Pace': return <Zap size={14} />;
      case 'Body Mechanics': return <Target size={14} />;
      case 'Strength': return <Dumbbell size={14} />;
      case 'Recovery': return <Heart size={14} />;
      case 'Run-Up': return <RotateCcw size={14} />;
      default: return <Target size={14} />;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Pace': return 'var(--color-accent-400)';
      case 'Body Mechanics': return 'var(--color-brand-400)';
      case 'Strength': return '#a78bfa';
      case 'Recovery': return '#22c55e';
      case 'Run-Up': return '#06b6d4';
      default: return 'var(--color-text-muted)';
    }
  };

  return (
    <div className="drills-page">
      <div className="page-header animate-fade-in-up">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Drills & Training</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
            Your personalized drill program based on your bowling analysis.
          </p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="view-toggle animate-fade-in-up delay-100">
        <button 
          className={`toggle-btn ${view === 'program' ? 'active' : ''}`}
          onClick={() => setView('program')}
        >
          <Clock size={16} /> Weekly Program
        </button>
        <button 
          className={`toggle-btn ${view === 'library' ? 'active' : ''}`}
          onClick={() => setView('library')}
        >
          <Target size={16} /> Drill Library
        </button>
      </div>

      {/* Weekly Program View */}
      {view === 'program' && (
        <div className="program-view animate-fade-in-up delay-200">
          {weeklyProgram.map((day, di) => (
            <div key={day.day} className="program-day glass-card-static">
              <div className="day-header">
                <h3 className="day-name">{day.day}</h3>
                <span className="day-count">{day.drills.length} {day.drills.length === 1 ? 'drill' : 'drills'}</span>
              </div>
              <div className="day-drills">
                {day.drills.map((drill, i) => (
                  <div key={i} className="day-drill-item">
                    <button className={`drill-checkbox ${day.done[i] ? 'done' : ''}`}>
                      {day.done[i] && <CheckCircle2 size={14} />}
                    </button>
                    <span style={{ 
                      textDecoration: day.done[i] ? 'line-through' : 'none',
                      opacity: day.done[i] ? 0.5 : 1,
                      fontSize: '0.875rem'
                    }}>{drill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Library View */}
      {view === 'library' && (
        <>
          {/* Category Filter */}
          <div className="category-filter animate-fade-in-up delay-200">
            {categories.map(cat => (
              <button 
                key={cat}
                className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="drills-grid animate-fade-in-up delay-300">
            {filteredDrills.map(drill => (
              <div 
                key={drill.id} 
                className="drill-card glass-card-static"
                onClick={() => setExpandedDrill(expandedDrill === drill.id ? null : drill.id)}
              >
                <div className="drill-card-header">
                  <div className="drill-cat-badge" style={{ 
                    color: getCategoryColor(drill.category),
                    background: `${getCategoryColor(drill.category)}15`
                  }}>
                    {getCategoryIcon(drill.category)}
                    {drill.category}
                  </div>
                  {drill.isPremium && (
                    <span className="badge-amber" style={{ fontSize: '0.625rem' }}>PRO</span>
                  )}
                  <button 
                    className={`fav-btn ${drill.isFavorite ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); }}
                  >
                    <Star size={14} fill={drill.isFavorite ? '#eab308' : 'none'} />
                  </button>
                </div>

                <h3 className="drill-card-name">{drill.name}</h3>
                <p className="drill-card-purpose">{drill.purpose}</p>

                <div className="drill-card-meta">
                  <span className="drill-meta-item">
                    <Clock size={12} /> {drill.sets}
                  </span>
                  <span className="drill-meta-item">
                    <Target size={12} /> {drill.targetArea}
                  </span>
                </div>

                {expandedDrill === drill.id && (
                  <div className="drill-expanded">
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-brand-400)', marginBottom: '0.5rem' }}>
                      COACHING CUES
                    </h4>
                    <ul className="drill-cues">
                      {drill.cues.map((cue, i) => (
                        <li key={i}>
                          <CheckCircle2 size={12} style={{ color: '#22c55e', flexShrink: 0 }} />
                          {cue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <style jsx>{`
        .drills-page { max-width: 900px; margin: 0 auto; }
        .page-header { margin-bottom: 1.5rem; }

        .view-toggle {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          padding: 0.25rem;
          background: rgba(255,255,255,0.03);
          border-radius: var(--radius-lg);
          border: 1px solid rgba(255,255,255,0.06);
          width: fit-content;
        }
        .toggle-btn {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          border: none;
          background: transparent;
          color: var(--color-text-muted);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: var(--font-sans);
        }
        .toggle-btn.active {
          background: rgba(43,141,255,0.15);
          color: var(--color-brand-400);
        }

        /* Program View */
        .program-view { display: flex; flex-direction: column; gap: 0.75rem; }
        .program-day { padding: 1.25rem; }
        .day-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .day-name { font-size: 1rem; font-weight: 700; }
        .day-count { font-size: 0.75rem; color: var(--color-text-muted); }
        .day-drills { display: flex; flex-direction: column; gap: 0.5rem; }
        .day-drill-item {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.5rem 0.75rem;
          background: rgba(255,255,255,0.02);
          border-radius: var(--radius-sm);
        }
        .drill-checkbox {
          width: 22px; height: 22px; border-radius: 6px;
          border: 2px solid rgba(255,255,255,0.15);
          background: transparent;
          color: transparent;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
          flex-shrink: 0;
        }
        .drill-checkbox.done {
          background: rgba(34,197,94,0.15);
          border-color: #22c55e;
          color: #22c55e;
        }

        /* Category Filter */
        .category-filter {
          display: flex; gap: 0.5rem; flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }
        .filter-chip {
          padding: 0.375rem 1rem;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: var(--color-text-secondary);
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: var(--font-sans);
        }
        .filter-chip.active {
          background: rgba(43,141,255,0.15);
          border-color: var(--color-brand-500);
          color: var(--color-brand-300);
        }

        /* Drill Cards */
        .drills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1rem;
        }
        .drill-card {
          padding: 1.25rem;
          cursor: pointer;
          transition: all 0.3s;
        }
        .drill-card:hover {
          border-color: rgba(255,255,255,0.12);
        }
        .drill-card-header {
          display: flex; align-items: center; gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        .drill-cat-badge {
          display: flex; align-items: center; gap: 0.375rem;
          font-size: 0.6875rem; font-weight: 600;
          padding: 0.125rem 0.5rem;
          border-radius: 999px;
        }
        .fav-btn {
          background: none; border: none;
          color: var(--color-text-muted);
          cursor: pointer; margin-left: auto;
          transition: color 0.2s;
        }
        .fav-btn.active { color: #eab308; }
        .drill-card-name {
          font-size: 1rem; font-weight: 700;
          margin-bottom: 0.375rem;
        }
        .drill-card-purpose {
          font-size: 0.8125rem; color: var(--color-text-secondary);
          line-height: 1.5; margin-bottom: 0.75rem;
        }
        .drill-card-meta {
          display: flex; gap: 1rem;
        }
        .drill-meta-item {
          display: flex; align-items: center; gap: 0.375rem;
          font-size: 0.75rem; color: var(--color-text-muted);
        }
        .drill-expanded {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          animation: fadeInUp 0.3s ease;
        }
        .drill-cues {
          list-style: none;
          display: flex; flex-direction: column; gap: 0.5rem;
        }
        .drill-cues li {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.8125rem; color: var(--color-text-secondary);
        }

        @media (max-width: 640px) {
          .drills-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
