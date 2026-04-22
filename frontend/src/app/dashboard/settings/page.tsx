'use client';

import { useState } from 'react';
import { 
  User, Bell, Shield, Key, Camera, Link as LinkIcon, 
  Smartphone, Monitor, HelpCircle, LogOut 
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Monitor },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: LinkIcon },
  ];

  return (
    <div className="settings-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account settings and preferences.</p>
        </div>
      </div>

      <div className="settings-layout">
        <aside className="settings-sidebar glass-card-static">
          <nav className="settings-nav">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
            
            <div className="nav-divider" />
            
            <button className="settings-nav-item">
              <HelpCircle size={18} />
              Help & Support
            </button>
            <button className="settings-nav-item text-danger">
              <LogOut size={18} />
              Sign Out
            </button>
          </nav>
        </aside>

        <div className="settings-content">
          {activeTab === 'profile' && (
            <div className="settings-section animate-fade-in">
              <h2 className="section-title">Profile Information</h2>
              
              <div className="glass-card section-card">
                <div className="avatar-section">
                  <div className="avatar-preview">
                    <User size={32} />
                  </div>
                  <div className="avatar-actions">
                    <button className="btn-secondary btn-sm">
                      <Camera size={16} />
                      Change Avatar
                    </button>
                    <button className="btn-ghost btn-sm text-danger">Remove</button>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text" defaultValue="Sufyan" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" defaultValue="Bowler" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" defaultValue="sufyan@example.com" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Bowling Style</label>
                    <select className="form-input" defaultValue="fast">
                      <option value="fast">Fast (140+ km/h)</option>
                      <option value="fast-medium">Fast-Medium (130-140 km/h)</option>
                      <option value="medium">Medium (120-130 km/h)</option>
                    </select>
                  </div>
                </div>

                <div className="card-actions">
                  <button className="btn-primary">Save Changes</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="settings-section animate-fade-in">
              <h2 className="section-title">Application Preferences</h2>
              
              <div className="glass-card section-card">
                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Unit System</h4>
                    <p>Measurement units used for pace and analysis.</p>
                  </div>
                  <div className="toggle-group">
                    <button className="toggle-btn active">Metric (km/h)</button>
                    <button className="toggle-btn">Imperial (mph)</button>
                  </div>
                </div>
                
                <div className="divider" />
                
                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Theme</h4>
                    <p>Choose your preferred interface theme.</p>
                  </div>
                  <div className="toggle-group">
                    <button className="toggle-btn">Light</button>
                    <button className="toggle-btn active">Dark</button>
                    <button className="toggle-btn">System</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Other tabs can be implemented similarly */}
          {(activeTab === 'notifications' || activeTab === 'security' || activeTab === 'integrations') && (
            <div className="settings-section animate-fade-in">
              <h2 className="section-title">{tabs.find(t => t.id === activeTab)?.label}</h2>
              <div className="glass-card section-card placeholder-state">
                <p>This settings section is under construction.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .settings-page {
          max-width: 1000px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .settings-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 2rem;
        }

        .settings-sidebar {
          padding: 1rem;
          height: fit-content;
        }

        .settings-nav {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .settings-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: var(--color-text-secondary);
          font-size: 0.9375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .settings-nav-item:hover {
          background: rgba(255,255,255,0.05);
          color: white;
        }

        .settings-nav-item.active {
          background: rgba(43, 141, 255, 0.1);
          color: var(--color-brand-400);
        }

        .text-danger {
          color: var(--color-accent-400) !important;
        }
        .text-danger:hover {
          background: rgba(239, 68, 68, 0.1) !important;
        }

        .nav-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 0.75rem 0;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
        }

        .section-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .avatar-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .avatar-preview {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-full);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
        }

        .avatar-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
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
          color: var(--color-text-secondary);
        }

        .form-input {
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: white;
          font-size: 0.9375rem;
          transition: all 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--color-brand-500);
          background: rgba(255,255,255,0.05);
        }

        select.form-input {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }
        
        select.form-input option {
          background: var(--color-surface-900);
          color: white;
        }

        .card-actions {
          display: flex;
          justify-content: flex-end;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        /* Preferences styling */
        .preference-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .preference-info h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        
        .preference-info p {
          font-size: 0.875rem;
          color: var(--color-text-muted);
        }
        
        .toggle-group {
          display: flex;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          padding: 4px;
        }
        
        .toggle-btn {
          padding: 0.5rem 1rem;
          background: transparent;
          border: none;
          border-radius: 6px;
          color: var(--color-text-secondary);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .toggle-btn.active {
          background: rgba(43, 141, 255, 0.15);
          color: var(--color-brand-400);
        }
        
        .divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
        }

        .placeholder-state {
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted);
        }

        @media (max-width: 768px) {
          .settings-layout {
            grid-template-columns: 1fr;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
          .preference-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
