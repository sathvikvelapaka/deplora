import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Box, Database, Activity, Code, Server, Play, ShieldCheck } from 'lucide-react';

const steps = [
  { id: 1, title: 'Code & Push', icon: <Code size={24}/>, desc: 'Data Scientist pushes model code to GitHub repo.' },
  { id: 2, title: 'CI/CD & GitOps', icon: <GitBranch size={24}/>, desc: 'GitHub Actions validates, ArgoCD syncs state.' },
  { id: 3, title: 'Pipeline Orchestration', icon: <Box size={24}/>, desc: 'Argo Workflows runs Data -> Train -> Validate.' },
  { id: 4, title: 'Model Registry', icon: <Database size={24}/>, desc: 'MLflow registers and versions the model artifact.' },
  { id: 5, title: 'Model Serving', icon: <Server size={24}/>, desc: 'KServe deploys a canary (10% traffic) endpoint.' },
  { id: 6, title: 'Monitoring & Rollout', icon: <Activity size={24}/>, desc: 'Prometheus checks health; auto-promotes to 100%.' },
];

const ArchitectureDiagram = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section className="section">
      <div className="section-header">
        <span className="badge">Workflow</span>
        <h2>End-to-End Pipeline Architecture</h2>
        <p>A true self-service path from experiment to production without DevOps tickets.</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', marginTop: '2rem' }}>
        
        {/* Left Side: Interactive Steps List */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {steps.map((step, idx) => (
            <motion.div 
              key={step.id}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                cursor: 'pointer',
                border: activeStep === step.id ? '1px solid var(--accent-blue)' : '1px solid var(--border-glass)',
                background: activeStep === step.id ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-card)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
              onClick={() => setActiveStep(step.id)}
              whileHover={{ x: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div style={{ 
                background: activeStep === step.id ? 'var(--accent-blue)' : 'rgba(255,255,255,0.1)',
                color: activeStep === step.id ? '#fff' : 'var(--text-muted)',
                width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {step.id}
              </div>
              <div>
                <h4 style={{ margin: 0, color: activeStep === step.id ? '#fff' : 'inherit' }}>{step.title}</h4>
                {activeStep === step.id && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#cbd5e1' }}
                  >
                    {step.desc}
                  </motion.p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Side: Visual Representation Area */}
        <div style={{ flex: '1 1 400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ width: '100%', height: '100%', minHeight: '400px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                transition={{ duration: 0.4 }}
                style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
              >
                <div style={{ 
                  width: '120px', height: '120px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
                  color: 'var(--accent-cyan)'
                }}>
                  {React.cloneElement(steps[activeStep-1].icon, { size: 64 })}
                </div>
                <div>
                  <h3 className="gradient-text">{steps[activeStep-1].title}</h3>
                  <p style={{ maxWidth: '300px', margin: '0 auto' }}>{steps[activeStep-1].desc}</p>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>
        </div>

      </div>
    </section>
  );
};

export default ArchitectureDiagram;
