import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Cloud, Settings, PlayCircle } from 'lucide-react';

const LayeredInfra = () => {
  const layers = [
    {
      id: 'l4',
      name: 'Layer 4: ML Applications',
      icon: <PlayCircle size={20} />,
      color: '#ec4899',
      items: ['InferenceServices', 'Training Workflows', 'Experiments']
    },
    {
      id: 'l3',
      name: 'Layer 3: ML Platform',
      icon: <Settings size={20} />,
      color: '#8b5cf6',
      items: ['Argo Workflows', 'MLflow', 'KServe', 'ArgoCD']
    },
    {
      id: 'l2',
      name: 'Layer 2: Platform Services',
      icon: <Layers size={20} />,
      color: '#3b82f6',
      items: ['Ingress Controller', 'cert-manager', 'Prometheus Stack', 'Chaos Mesh']
    },
    {
      id: 'l1',
      name: 'Layer 1: Cloud Infrastructure',
      icon: <Cloud size={20} />,
      color: '#10b981',
      items: ['AWS EKS / Azure AKS / GCP GKE', 'Spot GPUs', 'S3/Blob/GCS', 'IRSA/WIF']
    }
  ];

  return (
    <section className="section" style={{ minHeight: '80vh' }}>
      <div className="section-header">
        <span className="badge">Infrastructure</span>
        <h2>4-Tier Architecture Layers</h2>
        <p>Built modularly to ensure cloud-agnostic deployment while leveraging native features.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        {layers.map((layer, index) => (
          <motion.div
            key={layer.id}
            initial={{ opacity: 0, y: 50, rotateX: 20 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="glass-panel glass-panel-hover"
            style={{ 
              padding: '1.5rem 2rem', 
              borderLeft: `4px solid ${layer.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ color: layer.color, padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                {layer.icon}
              </div>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{layer.name}</h3>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {layer.items.map((item, idx) => (
                <span key={idx} style={{ 
                  fontSize: '0.8rem', padding: '0.25rem 0.75rem', 
                  background: 'rgba(255,255,255,0.05)', borderRadius: '999px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default LayeredInfra;
