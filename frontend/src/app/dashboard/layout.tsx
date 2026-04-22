'use client';

import Link from 'next/link';

/* ═══════════════════════════════════════════════════
   APP LAYOUT — Sidebar + Main Content
   ═══════════════════════════════════════════════════ */

import {
  LayoutDashboard, Video, FileText, Target, TrendingUp,
  Settings, Zap, LogOut, ChevronLeft, Menu,
  Calendar, Bell, User
} from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const sidebarItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/analyze', icon: Video, label: 'Analyze' },
  { href: '/dashboard/reports', icon: FileText, label: 'Reports' },
  { href: '/dashboard/drills', icon: Target, label: 'Drills' },
  { href: '/dashboard/progress', icon: TrendingUp, label: 'Progress' },
  { href: '/dashboard/sessions', icon: Calendar, label: 'Sessions' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="app-layout">
      {/* Mobile overlay */}
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`app-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <Link href="/" className="sidebar-logo">
            <div className="logo-icon-sm">
              <Zap size={18} />
            </div>
            {!sidebarCollapsed && <span className="logo-text-sm">BowlSmart</span>}
          </Link>
          <button className="sidebar-toggle hide-mobile" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <ChevronLeft size={16} style={{ transform: sidebarCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map(item => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon size={20} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <Link href="/dashboard/settings" className="sidebar-item" onClick={() => setMobileOpen(false)}>
            <Settings size={20} />
            {!sidebarCollapsed && <span>Settings</span>}
          </Link>
          <Link href="/" className="sidebar-item" onClick={() => setMobileOpen(false)}>
            <LogOut size={20} />
            {!sidebarCollapsed && <span>Log Out</span>}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="app-main">
        {/* Top bar */}
        <header className="app-topbar">
          <button className="mobile-menu-btn hide-desktop" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
          <div style={{ flex: 1 }} />
          <div className="topbar-actions">
            <button className="topbar-icon-btn">
              <Bell size={18} />
            </button>
            <div className="topbar-avatar">
              <User size={16} />
            </div>
          </div>
        </header>

        <div className="app-content">
          {children}
        </div>
      </main>

      <style jsx>{`
        .app-layout {
          display: flex;
          min-height: 100vh;
          background: var(--color-surface-950);
        }

        /* ── Sidebar ── */
        .app-sidebar {
          width: 260px;
          background: rgba(10, 15, 30, 0.95);
          border-right: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          transition: width 0.3s var(--ease-smooth);
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 50;
        }
        .app-sidebar.collapsed {
          width: 72px;
        }
        .sidebar-header {
          padding: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: white;
        }
        .logo-icon-sm {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--color-brand-600), var(--color-brand-700));
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .logo-text-sm {
          font-size: 1.125rem;
          font-weight: 800;
        }
        .sidebar-toggle {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: rgba(255,255,255,0.05);
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .sidebar-toggle:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }
        .sidebar-nav {
          flex: 1;
          padding: 1rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .sidebar-footer {
          padding: 0.75rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .sidebar-overlay {
          display: none;
        }

        /* ── Main ── */
        .app-main {
          flex: 1;
          margin-left: 260px;
          transition: margin-left 0.3s var(--ease-smooth);
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .app-sidebar.collapsed ~ .app-main {
          margin-left: 72px;
        }
        .app-topbar {
          display: flex;
          align-items: center;
          padding: 0.875rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(3,7,18,0.8);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .topbar-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .topbar-icon-btn:hover {
          background: rgba(255,255,255,0.08);
          color: white;
        }
        .topbar-avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, var(--color-brand-600), var(--color-accent-600));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
        }
        .mobile-menu-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0.25rem;
        }
        .app-content {
          flex: 1;
          padding: 1.5rem;
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .app-sidebar {
            transform: translateX(-100%);
            width: 280px;
          }
          .app-sidebar.mobile-open {
            transform: translateX(0);
          }
          .sidebar-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            z-index: 40;
          }
          .app-main {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
