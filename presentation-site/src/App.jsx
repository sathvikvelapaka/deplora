import React from 'react';
import HeroSection from './components/HeroSection';
import ProblemSolution from './components/ProblemSolution';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import LayeredInfra from './components/LayeredInfra';
import ServiceGrid from './components/ServiceGrid';

function App() {
  return (
    <div className="app-container">
      <HeroSection />
      <ProblemSolution />
      <ArchitectureDiagram />
      <LayeredInfra />
      <ServiceGrid />
      
      <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-glass)' }}>
        <p>Built for the Final Major Project - MLOps Platform</p>
      </footer>
    </div>
  );
}

export default App;
