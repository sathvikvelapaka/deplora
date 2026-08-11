import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, User, Settings, Search } from 'lucide-react';

const Header = ({ searchQuery, setSearchQuery }) => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return { title: 'Dashboard', sub: 'Platform overview and key metrics' };
      case '/deployments': return { title: 'Model Deployments', sub: 'Manage and monitor active inference services' };
      case '/infrastructure': return { title: 'Infrastructure', sub: 'Cluster health and resource utilization' };
      default: return { title: 'Overview', sub: 'Welcome back' };
    }
  };

  const { title, sub } = getPageTitle();

  return (
    <header className="top-header fade-in">
      <div>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '700' }}>{title}</h1>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{sub}</p>
      </div>
      
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <div className="glass-panel" style={{ 
          display: 'flex', alignItems: 'center', gap: '0.5rem', 
          padding: '0.5rem 1rem', borderRadius: '24px', 
          background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <Search size={16} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search resources..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              background: 'transparent', border: 'none', color: 'var(--text-main)', 
              outline: 'none', fontSize: '0.85rem', width: '200px' 
            }} 
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="glass-panel" style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)',
            color: 'var(--text-main)', cursor: 'pointer', transition: 'all 0.2s'
          }}>
            <Bell size={18} />
          </button>
          <button className="glass-panel" style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)',
            color: 'var(--text-main)', cursor: 'pointer', transition: 'all 0.2s'
          }}>
            <Settings size={18} />
          </button>
        </div>
        
        <div className="glass-panel" style={{ 
          display: 'flex', alignItems: 'center', gap: '0.75rem', 
          padding: '0.4rem 1rem 0.4rem 0.4rem', borderRadius: '24px',
          background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, transparent 100%)'
        }}>
          <div style={{ 
            width: '32px', height: '32px', borderRadius: '50%', 
            background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}>
            <User size={16} color="#fff" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', lineHeight: 1.2 }}>Alex Chen</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--primary)', lineHeight: 1.2 }}>ML Engineer</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
