import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Zap } from 'lucide-react';

const ProblemSolution = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="section" id="problem">
      <div className="section-header">
        <span className="badge">The Motivation</span>
        <h2>Why Do We Need MLOps?</h2>
        <p>ML teams often spend more time fighting infrastructure than doing actual machine learning.</p>
      </div>

      <motion.div 
        className="grid-2"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Traditional Approach Card */}
        <motion.div className="glass-panel glass-panel-hover" style={{ padding: '2.5rem' }} variants={itemVariants}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: 'var(--accent-red)' }}>
              <AlertTriangle size={28} />
            </div>
            <h3>Traditional Approach</h3>
          </div>
          
          <ul className="styled-list" style={{ marginTop: '1.5rem' }}>
            <li style={{ color: '#fca5a5' }}><strong style={{ color: '#fff'}}>Deployment:</strong> 2-3 days per model, manual config</li>
            <li style={{ color: '#fca5a5' }}><strong style={{ color: '#fff'}}>Consistency:</strong> "Works on my machine" bugs</li>
            <li style={{ color: '#fca5a5' }}><strong style={{ color: '#fff'}}>Tracking:</strong> Spreadsheets, lost experiments</li>
            <li style={{ color: '#fca5a5' }}><strong style={{ color: '#fff'}}>Resources:</strong> 60-70% GPU underutilization</li>
          </ul>
        </motion.div>

        {/* Platform Solution Card */}
        <motion.div className="glass-panel glass-panel-hover" style={{ padding: '2.5rem', border: '1px solid rgba(59,130,246,0.3)' }} variants={itemVariants}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--accent-blue)' }}>
              <Zap size={28} />
            </div>
            <h3>The Platform Solution</h3>
          </div>
          
          <ul className="styled-list" style={{ marginTop: '1.5rem' }}>
            <li style={{ color: '#93c5fd' }}><strong style={{ color: '#fff'}}>Deployment:</strong> ~15 minutes, self-service CI/CD</li>
            <li style={{ color: '#93c5fd' }}><strong style={{ color: '#fff'}}>Consistency:</strong> 100% reproducible environments</li>
            <li style={{ color: '#93c5fd' }}><strong style={{ color: '#fff'}}>Tracking:</strong> Automated via MLflow Registry</li>
            <li style={{ color: '#93c5fd' }}><strong style={{ color: '#fff'}}>Resources:</strong> ~60% cheaper with Spot + Karpenter</li>
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProblemSolution;
