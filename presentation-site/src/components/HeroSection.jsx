import React from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="section" style={{ minHeight: '100vh', justifyContent: 'center' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="badge">Final Major Project</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          MLOps Platform on <span className="gradient-text">Kubernetes</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ fontSize: '1.25rem', marginBottom: '2.5rem' }}
        >
          A multi-cloud reference platform for model training, versioning, and deployment on AWS EKS, Azure AKS, or GCP GKE.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
        >
          <button className="btn btn-primary" onClick={() => document.getElementById('problem').scrollIntoView({ behavior: 'smooth' })}>
            Explore Architecture <Rocket size={18} />
          </button>
        </motion.div>
      </div>

      {/* Abstract background element */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60vw',
        height: '60vw',
        background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 60%)',
        zIndex: -1,
        borderRadius: '50%',
      }} />
    </section>
  );
};

export default HeroSection;
