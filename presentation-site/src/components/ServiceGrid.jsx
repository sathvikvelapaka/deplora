import React from 'react';
import { motion } from 'framer-motion';
import { Database, Lock, Activity, RefreshCw, Cpu, FastForward } from 'lucide-react';

const services = [
  {
    name: 'KServe',
    icon: <FastForward size={24} />,
    color: '#06b6d4',
    purpose: 'Model Serving',
    reason: 'Serverless inference, scale-to-zero, canary deployments. Fully open-source (unlike Seldon Core).'
  },
  {
    name: 'MLflow',
    icon: <Database size={24} />,
    color: '#8b5cf6',
    purpose: 'Experiment Tracking',
    reason: 'Framework-agnostic, native GenAI support, largest community adoption.'
  },
  {
    name: 'ArgoCD',
    icon: <RefreshCw size={24} />,
    color: '#f59e0b',
    purpose: 'GitOps Continuous Delivery',
    reason: 'Declarative deployments, auto-syncing cluster state with GitHub repository.'
  },
  {
    name: 'Karpenter / KEDA',
    icon: <Cpu size={24} />,
    color: '#10b981',
    purpose: 'Autoscaling',
    reason: 'Dynamic GPU provisioning (AWS Karpenter) or Event-driven pod scaling (Azure KEDA) for ~60% cost savings.'
  },
  {
    name: 'Prometheus & Grafana',
    icon: <Activity size={24} />,
    color: '#f97316',
    purpose: 'Observability',
    reason: 'Industry standard for monitoring latency, errors, and GPU utilization metrics.'
  },
  {
    name: 'Kyverno & Tetragon',
    icon: <Lock size={24} />,
    color: '#ef4444',
    purpose: 'Security & Policies',
    reason: 'Policy-as-code and eBPF runtime monitoring for enterprise-grade security.'
  }
];

const ServiceGrid = () => {
  return (
    <section className="section">
      <div className="section-header">
        <span className="badge">Tech Stack</span>
        <h2>Best-in-Class Cloud Native Tools</h2>
        <p>No vendor lock-in. Built entirely with CNCF and Open Source projects.</p>
      </div>

      <div className="grid-3">
        {services.map((svc, index) => (
          <motion.div
            key={svc.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-panel glass-panel-hover"
            style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ color: svc.color, padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                {svc.icon}
              </div>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{svc.name}</h3>
            </div>
            
            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: svc.color, fontWeight: 'bold', letterSpacing: '0.05em' }}>
                {svc.purpose}
              </span>
              <p style={{ marginTop: '0.5rem', fontSize: '0.95rem', color: 'var(--text-main)', opacity: 0.8 }}>
                {svc.reason}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ServiceGrid;
