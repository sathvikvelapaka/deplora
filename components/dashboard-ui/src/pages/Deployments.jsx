import React from 'react';

const Deployments = () => {
  return (
    <div className="fade-in">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '500' }}>Active Deployments</h2>
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Mock Data: 3 Models actively served via KServe.</p>
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {['resnet50-v2', 'vgg16-classifier', 'fraud-detect-xgb'].map(model => (
            <div key={model} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <span style={{ fontWeight: '500' }}>{model}</span>
              <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span> Serving
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Deployments;
