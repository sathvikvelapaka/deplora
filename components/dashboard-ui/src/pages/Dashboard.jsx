import React, { useState } from 'react';
import ToolCard from '../components/ToolCard';
import MetricWidget from '../components/MetricWidget';
import MetricsChart from '../components/MetricsChart';
import { Database, Cpu, Activity, GitBranch, Layers, Code, Zap, Search, Filter } from 'lucide-react';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const tools = [
    {
      title: "MLflow Registry",
      category: "registry",
      description: "Track experiments, package models, and maintain the central model registry with @champion tagging.",
      icon: Layers,
      url: "http://localhost:5000"
    },
    {
      title: "ArgoCD GitOps",
      category: "cicd",
      description: "Continuous delivery for Kubernetes. Automated sync from Git manifest repositories.",
      icon: GitBranch,
      url: "http://localhost:8080"
    },
    {
      title: "Grafana Observability",
      category: "monitoring",
      description: "Visualize cluster metrics, model latency, error rates, and system alerts.",
      icon: Activity,
      url: "http://localhost:3000"
    },
    {
      title: "KServe Inference",
      category: "serving",
      description: "Serverless model serving on Kubernetes with autoscaling and canary traffic splits.",
      icon: Zap,
      url: "http://localhost:8081"
    },
    {
      title: "Argo Workflows",
      category: "cicd",
      description: "Orchestrate complex distributed ML pipelines and automated batch inference runs.",
      icon: Code,
      url: "http://localhost:2746"
    }
  ];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <MetricWidget title="Active Models" value="12" change="15%" trend="up" icon={Database} />
        <MetricWidget title="Cluster CPU Usage" value="42%" change="5%" trend="neutral" icon={Cpu} />
        <MetricWidget title="API Request / sec" value="2.4k" change="18%" trend="up" icon={Activity} />
      </div>

      <MetricsChart />

      {/* Services Section Header with Filter Controls */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: '1.5rem', marginTop: '1rem', flexWrap: 'wrap', gap: '1rem' 
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>Platform Services & Tools</h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Integrated MLOps components managed by the Deplora Orchestrator
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '3px', border: '1px solid var(--border-color)' }}>
            {[
              { id: 'all', label: 'All' },
              { id: 'registry', label: 'Registry' },
              { id: 'cicd', label: 'CI/CD' },
              { id: 'serving', label: 'Serving' },
              { id: 'monitoring', label: 'Telemetry' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '7px',
                  border: 'none',
                  background: activeCategory === tab.id ? 'var(--primary)' : 'transparent',
                  color: activeCategory === tab.id ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: activeCategory === tab.id ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.85rem 0.45rem 2rem',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-color)',
                color: '#fff',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>
      </div>
      
      {filteredTools.length > 0 ? (
        <div className="dashboard-grid" style={{ marginTop: 0, paddingBottom: '2rem' }}>
          {filteredTools.map((tool, index) => (
            <ToolCard 
              key={index}
              title={tool.title} 
              description={tool.description} 
              icon={tool.icon} 
              url={tool.url} 
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center', color: 'var(--text-muted)', borderStyle: 'dashed' }}>
          <Search size={40} style={{ opacity: 0.25, marginBottom: '0.75rem' }} />
          <h3>No services matching filter</h3>
          <p style={{ fontSize: '0.9rem' }}>No tools matched "{searchTerm}" in category "{activeCategory}".</p>
          <button 
            onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
            style={{
              marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: '8px',
              background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-color)',
              color: '#fff', fontSize: '0.85rem', cursor: 'pointer'
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;