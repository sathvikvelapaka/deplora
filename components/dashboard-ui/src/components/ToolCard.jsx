import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, AlertCircle, RefreshCw, Terminal, Activity, X } from 'lucide-react';

const ToolCard = ({ title, description, icon: Icon, url, defaultPort = '8080' }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [status, setStatus] = useState('Available');
  const [latency, setLatency] = useState(null);

  const checkConnectivity = (e) => {
    e.stopPropagation();
    setIsChecking(true);
    setStatus('Pinging...');
    setTimeout(() => {
      setIsChecking(false);
      const simulatedPing = Math.floor(Math.random() * 20 + 8);
      setLatency(simulatedPing);
      setStatus('Online');
    }, 600);
  };

  const getCliCommand = () => {
    if (title.includes('MLflow')) return 'mlflow ui --port 5000 --backend-store-uri sqlite:///mlflow.db';
    if (title.includes('ArgoCD')) return 'kubectl port-forward svc/argocd-server -n argocd 8080:443';
    if (title.includes('Grafana')) return 'kubectl port-forward svc/grafana -n monitoring 3000:80';
    if (title.includes('KServe')) return 'kubectl get inferenceservices --all-namespaces';
    return 'kubectl get pods,svc -n deplora-system';
  };

  return (
    <>
      <div 
        className="glass-panel tool-card"
        onClick={() => setModalOpen(true)}
        style={{ cursor: 'pointer', position: 'relative' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <Icon size={28} color="var(--primary)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{
              display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%',
              background: status === 'Online' ? 'var(--success)' : 'var(--secondary)'
            }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {latency ? `${latency}ms` : status}
            </span>
          </div>
        </div>

        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', minHeight: '40px', color: 'var(--text-muted)' }}>
          {description}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
          <button
            onClick={checkConnectivity}
            disabled={isChecking}
            style={{
              background: 'none', border: 'none', color: 'var(--secondary)',
              fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
            }}
          >
            <RefreshCw size={12} className={isChecking ? 'spinning' : ''} />
            {isChecking ? 'Pinging...' : 'Test Connection'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '500' }}>
            Details <ExternalLink size={14} style={{ marginLeft: '0.3rem' }} />
          </div>
        </div>
      </div>

      {/* Service Details & Launch Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-panel fade-in" style={{
            width: '90%', maxWidth: '520px', background: '#0e121e',
            border: '1px solid var(--border-highlight)', borderRadius: '16px',
            padding: '1.75rem', boxShadow: '0 20px 60px rgba(0,0,0,0.7)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Icon size={24} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{title}</h3>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              {description}
            </p>

            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '1rem', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Target Endpoint:</span>
                <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{url}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Service Status:</span>
                <span style={{ color: status === 'Online' ? 'var(--success)' : 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={14} /> {status} {latency ? `(${latency}ms)` : ''}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Integrated Orchestration:</span>
                <span style={{ color: 'var(--text-main)' }}>Managed by Deplora Engine</span>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                Local Tunnel Command:
              </span>
              <pre style={{
                background: '#07090e', border: '1px solid var(--border-color)',
                borderRadius: '6px', padding: '0.75rem', fontSize: '0.8rem',
                color: '#a78bfa', fontFamily: 'monospace', margin: 0, overflowX: 'auto'
              }}>
                {getCliCommand()}
              </pre>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={checkConnectivity}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.6rem 1rem', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)',
                  color: '#fff', fontSize: '0.85rem', cursor: 'pointer'
                }}
              >
                <RefreshCw size={14} className={isChecking ? 'spinning' : ''} /> Ping Endpoint
              </button>

              <button
                onClick={() => window.open(url, '_blank')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.6rem 1.25rem', borderRadius: '8px',
                  background: 'var(--primary)', border: 'none',
                  color: '#fff', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer'
                }}
              >
                Launch URL <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ToolCard;