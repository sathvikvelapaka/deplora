import React from 'react';
import ConductorControl from '../components/ConductorControl';
import ProjectOverview from './ProjectOverview';
import Dashboard from './Dashboard';
import Deployments from './Deployments';
import Infrastructure from './Infrastructure';
import Pipeline from './Pipeline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '12px', color: '#f87171' }}>
          <h3>Component Error</h3>
          <p>{this.state.error?.message || 'An unexpected error occurred in this view.'}</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Single-page view that displays the entire UI in one scrollable page.
 */
const AllInOne = () => (
  <div style={{ padding: '2rem', maxWidth: '1240px', margin: '0 auto' }}>
    <section id="conductor" style={{ marginBottom: '3.5rem' }}>
      <ErrorBoundary>
        <ConductorControl />
      </ErrorBoundary>
    </section>
    <section id="overview" style={{ marginBottom: '3rem' }}>
      <ErrorBoundary>
        <ProjectOverview />
      </ErrorBoundary>
    </section>
    <section id="dashboard" style={{ marginBottom: '3rem' }}>
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    </section>
    <section id="deployments" style={{ marginBottom: '3rem' }}>
      <ErrorBoundary>
        <Deployments />
      </ErrorBoundary>
    </section>
    <section id="infrastructure" style={{ marginBottom: '3rem' }}>
      <ErrorBoundary>
        <Infrastructure />
      </ErrorBoundary>
    </section>
    <section id="pipeline" style={{ marginBottom: '3rem' }}>
      <ErrorBoundary>
        <Pipeline />
      </ErrorBoundary>
    </section>
  </div>
);

export default AllInOne;
