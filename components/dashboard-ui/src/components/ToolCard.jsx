import React from 'react';
import { ExternalLink } from 'lucide-react';

const ToolCard = ({ title, description, icon: Icon, url, statusColor = 'var(--success)' }) => {
  return (
    <div 
      className="glass-panel tool-card"
      onClick={() => window.open(url, '_blank')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
          <Icon size={28} color="var(--primary)" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: statusColor }}></span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active</span>
        </div>
      </div>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', minHeight: '40px' }}>{description}</p>
      <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '500' }}>
        Launch Tool <ExternalLink size={16} style={{ marginLeft: '0.3rem' }} />
      </div>
    </div>
  );
};

export default ToolCard;
