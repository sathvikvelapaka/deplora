import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Rocket, Server, ChevronRight, Hexagon } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex', 
    alignItems: 'center', 
    gap: '0.875rem', 
    padding: '0.875rem 1.25rem', 
    borderRadius: '12px',
    textDecoration: 'none', 
    color: isActive ? '#fff' : 'var(--text-muted)',
    background: isActive ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)' : 'transparent',
    border: isActive ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
    boxShadow: isActive ? 'inset 2px 0 0 0 var(--primary)' : 'none',
    transition: 'all 0.3s ease',
    fontWeight: isActive ? '500' : '400',
    position: 'relative',
    overflow: 'hidden'
  });

  return (
    <aside className="sidebar">
      <div style={{ marginBottom: '3rem', padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
          padding: '0.5rem', 
          borderRadius: '10px',
          boxShadow: '0 4px 15px var(--primary-glow)' 
        }}>
          <Hexagon color="#fff" size={24} />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', letterSpacing: '0.05em' }} className="text-gradient">NEXUS</h2>
          <p style={{ fontSize: '0.7rem', marginTop: '0.1rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>MLOps Control</p>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
        <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', paddingLeft: '1.25rem', marginBottom: '0.25rem' }}>Menu</p>
        
        <NavLink to="/" style={navLinkStyle}>
          <LayoutDashboard size={20} color={location.pathname === '/' ? 'var(--primary)' : 'currentColor'} />
          Dashboard
          {location.pathname === '/' && <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
        </NavLink>

        <NavLink to="/deployments" style={navLinkStyle}>
          <Rocket size={20} color={location.pathname === '/deployments' ? 'var(--secondary)' : 'currentColor'} />
          Deployments
          {location.pathname === '/deployments' && <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
        </NavLink>

        <NavLink to="/infrastructure" style={navLinkStyle}>
          <Server size={20} color={location.pathname === '/infrastructure' ? 'var(--success)' : 'currentColor'} />
          Infrastructure
          {location.pathname === '/infrastructure' && <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
        </NavLink>
      </nav>

      <div className="glass-panel" style={{ marginTop: 'auto', padding: '1.25rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Cluster Status
          <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>EKS</span>
        </p>
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '0.85rem', fontWeight: '500' }}>
          <span className="status-dot pulsing" style={{ background: 'var(--success)' }}></span>
          All Systems Go
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
