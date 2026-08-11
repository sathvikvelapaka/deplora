import React from 'react';
import ToolCard from '../components/ToolCard';
import MetricWidget from '../components/MetricWidget';
import MetricsChart from '../components/MetricsChart';
import { Database, Cpu, Activity, GitBranch, Layers, Code, Zap, Search } from 'lucide-react';

const Dashboard = ({ searchQuery = '' }) => {
  const tools = [
    {
      title: "MLflow Registry",
      description: "Track experiments, package models, and maintain the central model registry.",
      icon: Layers,
      url: "http://localhost:5000"
    },
    {
      title: "ArgoCD GitOps",
      description: "Continuous delivery for Kubernetes. Manage application states via Git.",
      icon: GitBranch,
      url: "http://localhost:8080"
    },
    {
      title: "Grafana Observability",
      description: "Visualize cluster metrics, model performance, and system alerts.",
      icon: Activity,
      url: "http://localhost:3000"
    },
    {
      title: "KServe Inference",
      description: "Serverless model serving on Kubernetes with automated scaling to zero.",
      icon: Zap,
      url: "http://localhost:8081"
    },
    {
      title: "Argo Workflows",
      description: "Orchestrate complex ML pipelines and CI/CD operations.",
      icon: Code,
      url: "http://localhost:2746"
    }
  ];

  // Filter tools based on search query
  const filteredTools = tools.filter(tool => 
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <MetricWidget title="Active Models" value="12" change="15%" trend="up" icon={Database} />
        <MetricWidget title="Cluster CPU Usage" value="42%" change="5%" trend="neutral" icon={Cpu} />
        <MetricWidget title="API Request / sec" value="2.4k" change="18%" trend="up" icon={Activity} />
      </div>

      <MetricsChart />

      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '500', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Platform Services
        {searchQuery && (
          <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
            Filtered by "{searchQuery}"
          </span>
        )}
      </h2>
      
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
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)', borderStyle: 'dashed' }}>
          <Search size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <h3>No services found</h3>
          <p>We couldn't find any tools matching "{searchQuery}". Try adjusting your search.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
