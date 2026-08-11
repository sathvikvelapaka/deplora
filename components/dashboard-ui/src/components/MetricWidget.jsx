import React from 'react';

const MetricWidget = ({ title, value, change, trend = 'up', icon: Icon }) => {
  const trendColor = trend === 'up' ? 'var(--success)' : trend === 'down' ? 'var(--danger)' : 'var(--warning)';
  
  return (
    <div className="glass-panel metric-widget" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
        <Icon size={32} color="var(--primary)" />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{title}</p>
        <h2 style={{ margin: '0.2rem 0', fontSize: '1.8rem' }}>{value}</h2>
        <p style={{ margin: 0, fontSize: '0.85rem', color: trendColor, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {change} from last week
        </p>
      </div>
    </div>
  );
};

export default MetricWidget;
