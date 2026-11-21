import React, { useState } from 'react';
import { Rocket, RefreshCw, Plus, Minus, RotateCcw, CheckCircle2, Sliders, ExternalLink } from 'lucide-react';

const Deployments = () => {
  const [deployments, setDeployments] = useState([
    { id: 'sample-ml-app', name: 'sample-ml-app (Active Deplora)', version: 'v1.0', replicas: 2, status: 'Serving', canaryPercent: 10, memory: '256Mi', cpu: '100m' },
    { id: 'resnet50-v2', name: 'resnet50-vision', version: 'v2.4', replicas: 3, status: 'Serving', canaryPercent: 100, memory: '1Gi', cpu: '500m' },
    { id: 'vgg16-classifier', name: 'vgg16-classifier', version: 'v1.8', replicas: 1, status: 'Serving', canaryPercent: 100, memory: '512Mi', cpu: '250m' },
    { id: 'fraud-detect-xgb', name: 'fraud-detect-xgboost', version: 'v3.1', replicas: 4, status: 'Serving', canaryPercent: 20, memory: '512Mi', cpu: '200m' },
  ]);

  const [restartingId, setRestartingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleScale = (id, delta) => {
    setDeployments(prev => prev.map(d => {
      if (d.id === id) {
        const nextReplicas = Math.max(1, Math.min(10, d.replicas + delta));
        showToast(`Scaled ${d.name} to ${nextReplicas} pods`);
        return { ...d, replicas: nextReplicas, status: 'Scaling' };
      }
      return d;
    }));

    setTimeout(() => {
      setDeployments(prev => prev.map(d => d.id === id ? { ...d, status: 'Serving' } : d));
    }, 1200);
  };

  const handleRestart = (id) => {
    setRestartingId(id);
    showToast(`Restarting ${id} with rolling update...`);
    setDeployments(prev => prev.map(d => d.id === id ? { ...d, status: 'Rolling Update' } : d));

    setTimeout(() => {
      setRestartingId(null);
      setDeployments(prev => prev.map(d => d.id === id ? { ...d, status: 'Serving' } : d));
      showToast(`${id} pods successfully restarted!`);
    }, 1800);
  };

  const handleCanaryChange = (id, val) => {
    setDeployments(prev => prev.map(d => d.id === id ? { ...d, canaryPercent: Number(val) } : d));
  };

  return (
    <div className="fade-in">
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(56, 189, 248, 0.95)',
          color: '#0f172a',
          padding: '0.6rem 1.2rem',
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '0.85rem',
          zIndex: 9999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Rocket size={20} style={{ color: 'var(--primary)' }} /> Active Model Deployments
          </h2>
          <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Independently manage, scale, and route traffic to served ML microservices.
          </p>
        </div>

        <button
          onClick={() => {
            showToast('Refreshed all cluster deployment states');
          }}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#cbd5e1',
            padding: '0.4rem 0.8rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <RefreshCw size={14} /> Refresh Cluster
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {deployments.map(dep => (
          <div 
            key={dep.id} 
            className="glass-panel" 
            style={{
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: '1rem', color: '#fff' }}>{dep.name}</span>
                <span style={{ 
                  marginLeft: '0.6rem', 
                  background: 'rgba(255,255,255,0.08)', 
                  padding: '0.15rem 0.5rem', 
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)'
                }}>
                  {dep.version}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ 
                  color: dep.status === 'Serving' ? 'var(--success)' : '#38bdf8', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}>
                  <span style={{ 
                    display: 'inline-block', 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: dep.status === 'Serving' ? 'var(--success)' : '#38bdf8' 
                  }} /> 
                  {dep.status}
                </span>
              </div>
            </div>

            {/* Metrics & Controls Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
              
              {/* Resource info */}
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>CPU: <strong style={{ color: '#fff' }}>{dep.cpu}</strong></span>
                <span>Memory: <strong style={{ color: '#fff' }}>{dep.memory}</strong></span>
                <span>Canary Traffic: <strong style={{ color: '#38bdf8' }}>{dep.canaryPercent}%</strong></span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                
                {/* Pod Scaling */}
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <button
                    onClick={() => handleScale(dep.id, -1)}
                    disabled={dep.replicas <= 1}
                    style={{ background: 'transparent', border: 'none', color: '#fff', padding: '0.35rem 0.6rem', cursor: 'pointer' }}
                    title="Scale down"
                  >
                    <Minus size={13} />
                  </button>
                  <span style={{ padding: '0 0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>{dep.replicas} Pods</span>
                  <button
                    onClick={() => handleScale(dep.id, 1)}
                    disabled={dep.replicas >= 10}
                    style={{ background: 'transparent', border: 'none', color: '#fff', padding: '0.35rem 0.6rem', cursor: 'pointer' }}
                    title="Scale up"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Restart Service */}
                <button
                  onClick={() => handleRestart(dep.id)}
                  disabled={restartingId === dep.id}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <RefreshCw size={13} className={restartingId === dep.id ? 'animate-spin' : ''} /> Restart
                </button>

                {/* Quick Test */}
                <button
                  onClick={() => showToast(`Sent test ping to ${dep.name}: 200 OK (22ms)`)}
                  style={{
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    color: '#38bdf8',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Ping Endpoint
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Deployments;
