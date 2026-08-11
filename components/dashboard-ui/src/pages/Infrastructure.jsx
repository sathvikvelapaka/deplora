import React from 'react';

const Infrastructure = () => {
  return (
    <div className="fade-in">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '500' }}>Cluster Infrastructure</h2>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <span>Provider</span>
          <span style={{ fontWeight: '500' }}>AWS EKS</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <span>Region</span>
          <span style={{ fontWeight: '500' }}>us-west-2</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <span>Nodes</span>
          <span style={{ fontWeight: '500' }}>5 (3 CPU, 2 GPU)</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Status</span>
          <span style={{ color: 'var(--success)', fontWeight: '500' }}>Healthy</span>
        </div>
      </div>
    </div>
  );
};

export default Infrastructure;
