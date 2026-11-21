import React, { useState } from 'react';
import { 
  Bell, User, Settings, CheckCircle2, AlertTriangle, Info, 
  X, Save, RefreshCw, BookOpen, Terminal, Sparkles 
} from 'lucide-react';

/**
 * Enhanced interactive header for the Deplora MLOps platform.
 * Supports interactive notifications dropdown, settings modal, and quick-switch to guide.
 */
const Header = ({ activeTab, onSelectTab }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', text: 'Model artifact sentiment_model.pkl tagged as @champion', time: '5m ago', read: false },
    { id: 2, type: 'warning', text: 'Drift monitor: text_length mean shift +0.14 exceeds warn threshold', time: '22m ago', read: false },
    { id: 3, type: 'info', text: 'Local engine active on http://127.0.0.1:8000', time: '1h ago', read: true }
  ]);

  const [settings, setSettings] = useState({
    defaultCloud: 'aws',
    driftThreshold: 0.15,
    telemetryInterval: 5,
    autoDeployCanary: true,
    engineUrl: typeof window !== 'undefined' ? window.location.origin : 'http://127.0.0.1:8090'
  });
  
  const [saveStatus, setSaveStatus] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addSimulatedAlert = () => {
    const newAlert = {
      id: Date.now(),
      type: 'warning',
      text: `Alert: High inference latency spike (${Math.floor(Math.random() * 80 + 120)}ms) detected`,
      time: 'Just now',
      read: false
    };
    setNotifications([newAlert, ...notifications]);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaveStatus('Saving configuration...');
    setTimeout(() => {
      setSaveStatus('Configuration saved successfully!');
      setTimeout(() => {
        setSaveStatus('');
        setShowSettings(false);
      }, 1200);
    }, 400);
  };

  const tabTitles = {
    guide: 'How to Use & Quickstart Guide',
    conductor: 'Conductor Studio (Deployment & Manifests)',
    pipeline: 'CI/CD Pipeline Flow',
    deployments: 'Active Deployments & Canary Controls',
    infrastructure: 'Cluster Infrastructure & Terraform',
    dashboard: 'Platform Services & Observability',
    all: 'All-In-One Unified View'
  };

  return (
    <>
      <header className="top-header fade-in" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0.85rem 1.5rem', 
        background: 'rgba(10, 14, 26, 0.75)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(16px)'
      }}>
        {/* Left: View Breadcrumb & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }} className="text-gradient">
                Deplora
              </h1>
              <span style={{ color: 'var(--border-highlight)' }}>/</span>
              <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: '500' }}>
                {tabTitles[activeTab] || 'Dashboard'}
              </span>
            </div>
            <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Local MLOps Engine running at <code style={{ color: '#38bdf8' }}>{typeof window !== 'undefined' ? window.location.origin : 'http://127.0.0.1:8090'}</code>
            </p>
          </div>
        </div>

        {/* Right: Quick Guide Pill & Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', position: 'relative' }}>
          {/* Quick Guide Button */}
          <button
            onClick={() => onSelectTab && onSelectTab('guide')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.45rem',
              padding: '0.45rem 0.9rem', borderRadius: '10px',
              background: activeTab === 'guide' ? 'var(--primary)' : 'rgba(139, 92, 246, 0.15)',
              border: '1px solid var(--primary)',
              color: activeTab === 'guide' ? '#fff' : 'var(--primary)',
              fontWeight: '600', fontSize: '0.82rem', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <BookOpen size={15} /> How to Use
          </button>

          {/* Notifications Button */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowSettings(false);
                setShowUserMenu(false);
              }}
              className="glass-panel" 
              title="Notifications & Alerts"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '38px', height: '38px', borderRadius: '10px',
                background: showNotifications ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.04)', 
                border: showNotifications ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                color: showNotifications ? 'var(--primary)' : 'var(--text-main)', 
                cursor: 'pointer', transition: 'all 0.2s', position: 'relative'
              }}
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-3px', right: '-3px',
                  background: 'var(--danger)', color: '#fff',
                  fontSize: '0.62rem', fontWeight: 'bold',
                  width: '16px', height: '16px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="glass-panel fade-in" style={{
                position: 'absolute', right: 0, top: '48px', width: '360px',
                background: '#0d111c', border: '1px solid var(--border-highlight)',
                borderRadius: '14px', boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
                zIndex: 100, overflow: 'hidden'
              }}>
                <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Activity & Alerts</span>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{notifications.length}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer', padding: '2px 6px' }}>
                        Mark read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button onClick={clearNotifications} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', padding: '2px 6px' }}>
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      No alerts or notifications.
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} style={{
                        padding: '0.75rem 1rem',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        background: n.read ? 'transparent' : 'rgba(139, 92, 246, 0.05)',
                        display: 'flex', gap: '0.75rem', alignItems: 'flex-start'
                      }}>
                        {n.type === 'success' && <CheckCircle2 size={16} color="var(--success)" style={{ marginTop: '2px', flexShrink: 0 }} />}
                        {n.type === 'warning' && <AlertTriangle size={16} color="var(--warning)" style={{ marginTop: '2px', flexShrink: 0 }} />}
                        {n.type === 'info' && <Info size={16} color="var(--secondary)" style={{ marginTop: '2px', flexShrink: 0 }} />}
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: n.read ? 'var(--text-muted)' : 'var(--text-main)', lineHeight: 1.4 }}>
                            {n.text}
                          </p>
                          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px', display: 'block' }}>
                            {n.time}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ padding: '0.6rem 1rem', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center' }}>
                  <button 
                    onClick={addSimulatedAlert}
                    style={{ background: 'none', border: 'none', color: 'var(--secondary)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <RefreshCw size={12} /> Test New Event
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings Button */}
          <button 
            onClick={() => {
              setShowSettings(true);
              setShowNotifications(false);
              setShowUserMenu(false);
            }}
            className="glass-panel" 
            title="Conductor Settings"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '38px', height: '38px', borderRadius: '10px',
              background: showSettings ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.04)', 
              border: showSettings ? '1px solid var(--primary)' : '1px solid var(--border-color)',
              color: showSettings ? 'var(--primary)' : 'var(--text-main)', 
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            <Settings size={16} />
          </button>

          {/* Operator Profile Pill */}
          <div 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="glass-panel" 
            style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.3rem 0.75rem 0.3rem 0.3rem', borderRadius: '20px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <User size={14} color="#fff" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Local Operator</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--success)' }}>CLI Ready</span>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Settings size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Deplora Engine Settings</h3>
              </div>
              <button 
                onClick={() => setShowSettings(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                  Target Cloud Provider
                </label>
                <select 
                  value={settings.defaultCloud}
                  onChange={(e) => setSettings({ ...settings, defaultCloud: e.target.value })}
                  style={{
                    width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)',
                    color: '#fff', fontSize: '0.9rem'
                  }}
                >
                  <option value="aws" style={{ background: '#111' }}>AWS EKS (us-west-2)</option>
                  <option value="gcp" style={{ background: '#111' }}>GCP GKE (us-central1)</option>
                  <option value="azure" style={{ background: '#111' }}>Azure AKS (eastus)</option>
                  <option value="local" style={{ background: '#111' }}>Local Minikube / Kind</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                  <span>Drift Detection Threshold (p-value)</span>
                  <span style={{ color: 'var(--secondary)' }}>{settings.driftThreshold}</span>
                </label>
                <input 
                  type="range" 
                  min="0.05" 
                  max="0.5" 
                  step="0.05"
                  value={settings.driftThreshold}
                  onChange={(e) => setSettings({ ...settings, driftThreshold: parseFloat(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                  <span>Telemetry Polling Interval (seconds)</span>
                  <span style={{ color: 'var(--secondary)' }}>{settings.telemetryInterval}s</span>
                </label>
                <input 
                  type="range" 
                  min="2" 
                  max="30" 
                  step="1"
                  value={settings.telemetryInterval}
                  onChange={(e) => setSettings({ ...settings, telemetryInterval: parseInt(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                  Deplora Orchestrator Backend URL
                </label>
                <input 
                  type="text" 
                  value={settings.engineUrl}
                  onChange={(e) => setSettings({ ...settings, engineUrl: e.target.value })}
                  style={{
                    width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)',
                    color: '#fff', fontSize: '0.9rem'
                  }}
                />
              </div>

              {saveStatus && (
                <div style={{
                  padding: '0.65rem', borderRadius: '8px', fontSize: '0.85rem',
                  background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--success)',
                  color: 'var(--success)', textAlign: 'center'
                }}>
                  {saveStatus}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowSettings(false)}
                  style={{
                    padding: '0.6rem 1.2rem', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)',
                    color: 'var(--text-muted)', cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{
                    padding: '0.6rem 1.4rem', borderRadius: '8px',
                    background: 'var(--primary)', border: 'none',
                    color: '#fff', fontWeight: '600', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    boxShadow: '0 4px 12px var(--primary-glow)'
                  }}
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;