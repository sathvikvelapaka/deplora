import React from 'react';
import { 
  LayoutDashboard, Rocket, Server, Hexagon, PlayCircle, GitFork, 
  BookOpen, Layers, Sparkles, CheckCircle2, ChevronRight 
} from 'lucide-react';

/**
 * Modern interactive sidebar navigation for the Deplora MLOps Conductor.
 * Cleanly switches views without cluttered page-scrolling dumps.
 */
const Sidebar = ({ activeTab, onSelectTab }) => {
  const getNavItemStyle = (tabId) => {
    const isActive = activeTab === tabId;
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.75rem',
      padding: '0.8rem 1.1rem',
      borderRadius: '12px',
      textDecoration: 'none',
      color: isActive ? '#fff' : 'var(--text-muted)',
      background: isActive 
        ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.25) 0%, rgba(6, 182, 212, 0.1) 100%)' 
        : 'transparent',
      borderLeft: isActive ? '3px solid var(--secondary)' : '3px solid transparent',
      transition: 'all 0.25s ease',
      fontWeight: isActive ? '600' : '400',
      cursor: 'pointer',
    };
  };

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div 
        onClick={() => onSelectTab('guide')}
        style={{ 
          marginBottom: '2rem', padding: '0.5rem', display: 'flex', 
          alignItems: 'center', gap: '0.75rem', cursor: 'pointer' 
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            padding: '0.55rem',
            borderRadius: '12px',
            boxShadow: '0 4px 18px var(--primary-glow)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <Hexagon color="#fff" size={24} />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', letterSpacing: '0.04em' }} className="text-gradient">
            Deplora
          </h2>
          <p style={{ fontSize: '0.72rem', marginTop: '0.1rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            MLOps Conductor
          </p>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
        {/* Getting Started Section */}
        <p style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', paddingLeft: '1rem', marginBottom: '0.2rem' }}>
          Getting Started
        </p>

        <div onClick={() => onSelectTab('guide')} style={getNavItemStyle('guide')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BookOpen size={18} color={activeTab === 'guide' ? 'var(--secondary)' : 'inherit'} />
            <span style={{ fontSize: '0.9rem' }}>How to Use & Guide</span>
          </div>
          <span className="badge badge-success" style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem' }}>
            Start Here
          </span>
        </div>

        {/* Core Orchestration */}
        <p style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', paddingLeft: '1rem', margin: '0.75rem 0 0.2rem 0' }}>
          Core Conductor
        </p>

        <div onClick={() => onSelectTab('conductor')} style={getNavItemStyle('conductor')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <PlayCircle size={18} color={activeTab === 'conductor' ? 'var(--primary)' : 'inherit'} />
            <span style={{ fontSize: '0.9rem' }}>Conductor Studio</span>
          </div>
          <span className="badge badge-primary" style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem' }}>
            Deploy
          </span>
        </div>

        <div onClick={() => onSelectTab('pipeline')} style={getNavItemStyle('pipeline')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <GitFork size={18} color={activeTab === 'pipeline' ? '#38bdf8' : 'inherit'} />
            <span style={{ fontSize: '0.9rem' }}>CI/CD Pipeline Flow</span>
          </div>
        </div>

        {/* Live Operations */}
        <p style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', paddingLeft: '1rem', margin: '0.75rem 0 0.2rem 0' }}>
          Operations & Cloud
        </p>

        <div onClick={() => onSelectTab('deployments')} style={getNavItemStyle('deployments')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Rocket size={18} color={activeTab === 'deployments' ? 'var(--secondary)' : 'inherit'} />
            <span style={{ fontSize: '0.9rem' }}>Pods & Canary Split</span>
          </div>
        </div>

        <div onClick={() => onSelectTab('infrastructure')} style={getNavItemStyle('infrastructure')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Server size={18} color={activeTab === 'infrastructure' ? '#a78bfa' : 'inherit'} />
            <span style={{ fontSize: '0.9rem' }}>Cluster & Terraform</span>
          </div>
        </div>

        <div onClick={() => onSelectTab('dashboard')} style={getNavItemStyle('dashboard')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <LayoutDashboard size={18} color={activeTab === 'dashboard' ? 'var(--primary)' : 'inherit'} />
            <span style={{ fontSize: '0.9rem' }}>Services & Metrics</span>
          </div>
        </div>

        <div onClick={() => onSelectTab('all')} style={getNavItemStyle('all')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Layers size={18} color={activeTab === 'all' ? 'var(--text-muted)' : 'inherit'} />
            <span style={{ fontSize: '0.85rem' }}>All-In-One View</span>
          </div>
        </div>
      </nav>

      {/* Engine Status Footer */}
      <div 
        onClick={() => onSelectTab('guide')}
        className="glass-panel" 
        style={{ 
          marginTop: 'auto', padding: '1rem', borderRadius: '12px', 
          background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Engine Status</span>
          <span className="badge badge-success" style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem' }}>
            ONLINE
          </span>
        </div>
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '0.82rem', fontWeight: '600' }}>
          <span className="status-dot pulsing" style={{ background: 'var(--success)' }} />
          {typeof window !== 'undefined' ? window.location.host : 'localhost:8090'}
        </p>
        <span style={{ fontSize: '0.7rem', color: 'var(--secondary)', display: 'block', marginTop: '0.4rem' }}>
          Click for CLI Guide →
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;