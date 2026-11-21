import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import GuideWalkthrough from './components/GuideWalkthrough';
import ConductorControl from './components/ConductorControl';
import Deployments from './pages/Deployments';
import Infrastructure from './pages/Infrastructure';
import Pipeline from './pages/Pipeline';
import Dashboard from './pages/Dashboard';
import AllInOne from './pages/AllInOne';
import { BookOpen, PlayCircle, GitFork, Rocket, Server, LayoutDashboard, Layers } from 'lucide-react';

/**
 * Main application container with dedicated tab routing.
 * Solves visual clutter by providing clean, single-purpose views and an interactive guide.
 */
function App() {
  const [activeTab, setActiveTab] = useState('guide');

  const tabs = [
    { id: 'guide', label: '1. Guide & Mental Model', icon: BookOpen, badge: 'Start Here' },
    { id: 'conductor', label: '2. Conductor Studio', icon: PlayCircle, badge: 'Deploy' },
    { id: 'pipeline', label: '3. Pipeline Flow', icon: GitFork },
    { id: 'deployments', label: '4. Active Pods & Canary', icon: Rocket },
    { id: 'infrastructure', label: '5. Multi-Cloud K8s', icon: Server },
    { id: 'dashboard', label: '6. Services & Metrics', icon: LayoutDashboard },
    { id: 'all', label: 'All-In-One', icon: Layers },
  ];

  return (
    <div className="app-container">
      {/* Sidebar with active tab switching */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      <main className="main-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        {/* Top Header */}
        <Header activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Tab Switcher Bar */}
        <div style={{
          display: 'flex',
          gap: '0.4rem',
          padding: '0.75rem 1.5rem',
          background: 'rgba(255, 255, 255, 0.02)',
          borderBottom: '1px solid var(--border-color)',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '10px',
                  border: isActive ? '1px solid var(--primary)' : '1px solid transparent',
                  background: isActive ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  fontWeight: isActive ? '600' : '400',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
              >
                <Icon size={14} color={isActive ? 'var(--primary)' : 'inherit'} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={isActive ? 'badge badge-primary' : 'badge badge-success'} style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem' }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tab View */}
        <div style={{ padding: '1.75rem', flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
          {activeTab === 'guide' && (
            <GuideWalkthrough 
              onLaunchDemo={() => setActiveTab('conductor')} 
              onSwitchTab={setActiveTab} 
            />
          )}

          {activeTab === 'conductor' && (
            <div className="fade-in">
              <ConductorControl />
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div className="fade-in">
              <Pipeline />
            </div>
          )}

          {activeTab === 'deployments' && (
            <div className="fade-in">
              <Deployments />
            </div>
          )}

          {activeTab === 'infrastructure' && (
            <div className="fade-in">
              <Infrastructure />
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="fade-in">
              <Dashboard />
            </div>
          )}

          {activeTab === 'all' && (
            <div className="fade-in">
              <AllInOne />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;