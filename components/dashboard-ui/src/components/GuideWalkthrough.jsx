import React, { useState } from 'react';
import { 
  Rocket, Terminal, Layers, ArrowRight, Play, PlayCircle, CheckCircle2, 
  HelpCircle, Sparkles, Box, ShieldCheck, Activity, Copy, BookOpen, 
  ExternalLink, RefreshCw, Cpu, Server, GitFork, RotateCcw, 
  Sliders, AlertTriangle, Check, Info, Cloud, Database, BarChart3
} from 'lucide-react';

const GuideWalkthrough = ({ onLaunchDemo, onSwitchTab }) => {
  const [activeGuideTab, setActiveGuideTab] = useState('beginner');
  const [copiedCmd, setCopiedCmd] = useState('');
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(''), 2000);
  };

  const handleRunInteractiveDemo = () => {
    setDemoRunning(true);
    setDemoStep(1); // scanning
    setTimeout(() => {
      setDemoStep(2); // generating
      setTimeout(() => {
        setDemoStep(3); // testing
        setTimeout(() => {
          setDemoRunning(false);
          if (onLaunchDemo) onLaunchDemo();
        }, 800);
      }, 800);
    }, 800);
  };

  return (
    <div className="fade-in" style={{ maxWidth: '1180px', margin: '0 auto', paddingBottom: '3.5rem' }}>
      
      {/* Hero Banner: The Master Mental Model */}
      <div className="glass-panel" style={{
        padding: '2.5rem',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.14) 0%, rgba(6, 182, 212, 0.09) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.35)',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <span className="badge badge-primary" style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <Sparkles size={13} style={{ display: 'inline', marginRight: '5px' }} />
            The Complete Deplora Master Guide
          </span>
          <span className="badge badge-success" style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem' }}>
            Beginner to Advanced
          </span>
        </div>

        <h1 style={{ fontSize: '2.3rem', fontWeight: '800', lineHeight: 1.25, marginBottom: '0.85rem' }} className="text-gradient">
          Take Any ML App to Cloud Production in Minutes
        </h1>
        
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '850px', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          <strong>Deplora</strong> is a locally installed MLOps orchestration engine. You give Deplora your ML project code (weights + API), and it automatically handles containerization, Jenkins CI/CD, Terraform infrastructure, Kubernetes microservices, Prometheus monitoring, and zero-downtime rollbacks.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleRunInteractiveDemo}
            disabled={demoRunning}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.8rem 1.6rem', borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
              border: 'none', color: '#fff', fontWeight: '700', fontSize: '0.95rem',
              cursor: demoRunning ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 20px var(--primary-glow)'
            }}
          >
            {demoRunning ? (
              <>
                <RefreshCw size={18} className="spinning" />
                {demoStep === 1 && 'Step 1/3: Analyzing sample project...'}
                {demoStep === 2 && 'Step 2/3: Decoupling microservices...'}
                {demoStep === 3 && 'Step 3/3: Opening Conductor Studio...'}
              </>
            ) : (
              <>
                <Play size={18} /> Launch 30-Second Guided Tour
              </>
            )}
          </button>

          <button
            onClick={() => onSwitchTab('conductor')}
            className="glass-panel"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.8rem 1.4rem', borderRadius: '10px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)',
              color: '#fff', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer'
            }}
          >
            <Rocket size={18} color="var(--secondary)" /> Open Conductor Studio
          </button>

          <button
            onClick={() => onSwitchTab('pipeline')}
            className="glass-panel"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.8rem 1.4rem', borderRadius: '10px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)',
              color: '#fff', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer'
            }}
          >
            <GitFork size={18} color="#38bdf8" /> View 12-Stage CI/CD Pipeline
          </button>
        </div>
      </div>

      {/* Guide Navigation Tabs (Level Selector) */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '0.5rem',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '14px',
        border: '1px solid var(--border-color)',
        marginBottom: '2rem',
        overflowX: 'auto'
      }}>
        {[
          { id: 'beginner', label: '🔰 Beginner: 5-Min Quickstart', desc: 'Pre-flight, Start, Analysis, 1-Click Deploy' },
          { id: 'intermediate', label: '⚡ Intermediate: Architecture & Scaling', desc: 'Decoupling, Modes, Replicas, Metrics' },
          { id: 'advanced', label: '🔥 Advanced: CI/CD & Multi-Cloud', desc: 'Jenkins, Terraform, Rollback, Canary' },
          { id: 'cli', label: '🛠️ CLI Commands & Reference', desc: 'Terminal Cheat Sheet & Syntax' },
          { id: 'faq', label: '❓ Troubleshooting & FAQ', desc: 'Port Conflicts, Creds, Common Fixes' },
        ].map((tab) => {
          const isActive = activeGuideTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveGuideTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '180px',
                textAlign: 'left',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: isActive ? '1px solid var(--primary)' : '1px solid transparent',
                background: isActive ? 'rgba(139, 92, 246, 0.22)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ color: isActive ? '#fff' : 'var(--text-muted)', fontWeight: isActive ? '700' : '500', fontSize: '0.88rem' }}>
                {tab.label}
              </div>
              <div style={{ fontSize: '0.72rem', color: isActive ? 'var(--secondary)' : 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                {tab.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: BEGINNER (5-Minute Quickstart)
         ========================================================================= */}
      {activeGuideTab === 'beginner' && (
        <div className="fade-in">
          {/* Mental Model Card */}
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <BookOpen size={20} color="var(--primary)" /> The Mental Model: How Deplora Works
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Think of Deplora like <strong>Jenkins for MLOps</strong>, running on your laptop. You never upload your model to a mystery SaaS. You point Deplora to your ML folder, and Deplora coordinates the battle-tested tools you already trust:
            </p>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem'
            }}>
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: '#38bdf8' }}>1. Developer Project</strong>
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Your Python app with <code>app.py</code>, <code>requirements.txt</code>, and <code>model.pkl</code> or <code>.pt</code>.
                </p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: '#a78bfa' }}>2. Deplora Engine</strong>
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Locally running daemon with REST API + Web Dashboard (this UI at <code>http://localhost:8090</code>).
                </p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: '#34d399' }}>3. Orchestrated Stack</strong>
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Generates Dockerfiles, triggers Jenkins pipelines, deploys with Terraform to AWS/GCP/Azure Kubernetes.
                </p>
              </div>
            </div>
          </div>

          {/* Step-by-Step Beginner Walkthrough */}
          <h2 style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Rocket size={20} color="var(--secondary)" /> Beginner Step-by-Step Walkthrough
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
            
            {/* Step 1 */}
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{
                background: 'rgba(139, 92, 246, 0.2)', border: '1px solid var(--primary)',
                color: 'var(--primary)', width: '38px', height: '38px', borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0
              }}>
                1
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem' }}>Check Prerequisites & Install</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
                  Ensure you have Python 3.10+, Docker, and kubectl installed. Deplora installs directly into your environment:
                </p>
                <div style={{ background: '#07090e', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.6rem 0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <code style={{ color: '#38bdf8', fontSize: '0.83rem', fontFamily: 'monospace' }}>
                    pip install -e . && deplora check
                  </code>
                  <button onClick={() => copyToClipboard('pip install -e . && deplora check', 'b1')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {copiedCmd === 'b1' ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{
                background: 'rgba(6, 182, 212, 0.2)', border: '1px solid var(--secondary)',
                color: 'var(--secondary)', width: '38px', height: '38px', borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0
              }}>
                2
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem' }}>Start the Deplora Engine</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
                  Navigate to your ML project folder and launch the engine. If port 8080 is occupied by Jenkins, Deplora automatically binds to a free port like <strong>8090</strong>:
                </p>
                <div style={{ background: '#07090e', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.6rem 0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <code style={{ color: '#4ade80', fontSize: '0.83rem', fontFamily: 'monospace' }}>
                    cd examples/sample-ml-app && deplora start
                  </code>
                  <button onClick={() => copyToClipboard('cd examples/sample-ml-app && deplora start', 'b2')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {copiedCmd === 'b2' ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                  </button>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--secondary)' }}>
                  💡 Open your browser at <code>http://localhost:8090</code> (or the port printed in your terminal).
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--success)',
                color: 'var(--success)', width: '38px', height: '38px', borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0
              }}>
                3
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem' }}>Analyze the Project Codebase</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
                  Deplora inspects Python AST syntax trees to discover your web routes (FastAPI/Flask) and ML artifacts (Scikit-Learn, PyTorch, TensorFlow):
                </p>
                <div style={{ background: '#07090e', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.6rem 0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <code style={{ color: '#a78bfa', fontSize: '0.83rem', fontFamily: 'monospace' }}>
                    deplora analyze
                  </code>
                  <button onClick={() => copyToClipboard('deplora analyze', 'b3')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {copiedCmd === 'b3' ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{
                background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b',
                color: '#f59e0b', width: '38px', height: '38px', borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0
              }}>
                4
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem' }}>Deploy with 1 Click</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
                  Switch to <strong>Conductor Studio</strong> tab in this UI and click <strong>"Deploy"</strong>, or run via terminal:
                </p>
                <div style={{ background: '#07090e', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.6rem 0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <code style={{ color: '#38bdf8', fontSize: '0.83rem', fontFamily: 'monospace' }}>
                    deplora deploy --mode full_app --cloud AWS
                  </code>
                  <button onClick={() => copyToClipboard('deplora deploy --mode full_app --cloud AWS', 'b4')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {copiedCmd === 'b4' ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{
                background: 'rgba(236, 72, 153, 0.2)', border: '1px solid #ec4899',
                color: '#ec4899', width: '38px', height: '38px', borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0
              }}>
                5
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem' }}>Verify & Test Inference</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
                  Send a sample inference payload to test prediction accuracy and measure roundtrip latency:
                </p>
                <div style={{ background: '#07090e', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.6rem 0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <code style={{ color: '#34d399', fontSize: '0.83rem', fontFamily: 'monospace' }}>
                    deplora test --text "Deplora is amazing!"
                  </code>
                  <button onClick={() => copyToClipboard('deplora test --text "Deplora is amazing!"', 'b5')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {copiedCmd === 'b5' ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: INTERMEDIATE (Decoupled Architecture & Scaling)
         ========================================================================= */}
      {activeGuideTab === 'intermediate' && (
        <div className="fade-in">
          {/* Decoupling Explanation */}
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Layers size={20} color="var(--primary)" /> Why Deplora Decouples App & Model Microservices
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              In traditional monolithic setups, bundling your 2GB PyTorch model inside the web server means every web scale-out pulls giant images, causing slow autoscaling and memory crashes. 
              <strong> Deplora automatically splits your project into two distinct microservices:</strong>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{
                background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px', padding: '1.35rem'
              }}>
                <span className="badge badge-primary" style={{ marginBottom: '0.6rem', display: 'inline-block' }}>Microservice A</span>
                <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '1.05rem' }}>Application Pod (API / Web)</h4>
                <ul style={{ margin: '0.5rem 0 0 1.2rem', padding: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  <li>Hosts FastAPI / Flask endpoints and client authentication.</li>
                  <li>Ultra-lightweight Docker image (~120 MB).</li>
                  <li>Scales from 1 to 50 pods in seconds based on HTTP request volume.</li>
                  <li>Independent CI/CD rebuilds when only UI or API routes change.</li>
                </ul>
              </div>

              <div style={{
                background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '12px', padding: '1.35rem'
              }}>
                <span className="badge badge-secondary" style={{ marginBottom: '0.6rem', display: 'inline-block' }}>Microservice B</span>
                <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '1.05rem' }}>Inference Pod (Model Server)</h4>
                <ul style={{ margin: '0.5rem 0 0 1.2rem', padding: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  <li>Loads model weights (<code>sentiment_model.pkl</code> / <code>model.pt</code>).</li>
                  <li>Runs optimized C++ runtimes or GPU workers.</li>
                  <li>Autoscales on GPU utilization and inference queue depth.</li>
                  <li>Independent model rollback without touching web API pods.</li>
                </ul>
              </div>
            </div>

            {/* Deployment Modes Table */}
            <h4 style={{ fontSize: '1.05rem', margin: '1.5rem 0 0.75rem 0' }}>The 3 Deployment Modes</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Mode</th>
                    <th style={{ padding: '0.75rem 1rem' }}>What Gets Deployed</th>
                    <th style={{ padding: '0.75rem 1rem' }}>CLI Flag</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.75rem 1rem' }}><strong style={{ color: 'var(--primary)' }}>full_app</strong> (Default)</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Deploys both Application and Model Pods with internal service discovery.</td>
                    <td style={{ padding: '0.75rem 1rem' }}><code>--mode full_app</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.75rem 1rem' }}><strong style={{ color: 'var(--secondary)' }}>model_only</strong></td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Updates only the model weights and inference pod. Zero impact on web app.</td>
                    <td style={{ padding: '0.75rem 1rem' }}><code>--mode model_only</code></td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.75rem 1rem' }}><strong style={{ color: '#34d399' }}>app_only</strong></td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Updates web/API endpoints without reloading heavy model weights.</td>
                    <td style={{ padding: '0.75rem 1rem' }}><code>--mode app_only</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Scaling & Dual Telemetry */}
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Sliders size={18} color="var(--secondary)" /> Dynamic Autoscaling & Replica Management
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1rem' }}>
              Scale services independently in real-time without restarting your cluster:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div style={{ background: '#07090e', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.85rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Scale both App & Model to 4 replicas:</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <code style={{ color: '#38bdf8', fontSize: '0.82rem' }}>deplora scale --target all --replicas 4</code>
                  <button onClick={() => copyToClipboard('deplora scale --target all --replicas 4', 's1')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {copiedCmd === 's1' ? <Check size={13} color="var(--success)" /> : <Copy size={13} />}
                  </button>
                </div>
              </div>
              <div style={{ background: '#07090e', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.85rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Scale only Model inference service:</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <code style={{ color: '#a78bfa', fontSize: '0.82rem' }}>deplora scale --target model --replicas 6</code>
                  <button onClick={() => copyToClipboard('deplora scale --target model --replicas 6', 's2')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {copiedCmd === 's2' ? <Check size={13} color="var(--success)" /> : <Copy size={13} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: ADVANCED (CI/CD, Multi-Cloud, Rollback)
         ========================================================================= */}
      {activeGuideTab === 'advanced' && (
        <div className="fade-in">
          {/* Jenkins CI/CD Orchestration */}
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <GitFork size={20} color="var(--primary)" /> How Deplora Orchestrates Jenkins CI/CD
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              You don't need to manually configure Jenkins plugins, credentials, or Groovy Jenkinsfiles. Deplora synthesizes a dynamic 12-stage declarative pipeline and pushes it via Jenkins REST API:
            </p>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem'
            }}>
              {[
                '1. AST Scan', '2. Unit Tests', '3. Decouple', '4. Docker Build App',
                '5. Docker Build Model', '6. Security Scan', '7. Push to Registry', '8. Terraform Apply',
                '9. Helm/K8s Deploy', '10. Health Check', '11. Canary Shift', '12. Active Telemetry'
              ].map((stage, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)',
                  borderRadius: '8px', padding: '0.6rem 0.8rem', fontSize: '0.78rem',
                  display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fff'
                }}>
                  <CheckCircle2 size={13} color="var(--success)" />
                  <span>{stage}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => onSwitchTab('pipeline')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.6rem 1.1rem', borderRadius: '8px',
                  background: 'var(--primary)', border: 'none', color: '#fff',
                  fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer'
                }}
              >
                <GitFork size={15} /> Open Live Pipeline Stepper View
              </button>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Or connect to external Jenkins: <code>deplora connect --service jenkins --url http://localhost:8080</code>
              </span>
            </div>
          </div>

          {/* Instant Rollback & Canary */}
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <RotateCcw size={18} color="var(--secondary)" /> Zero-Downtime Rollback & Canary Routing
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              If a new model introduces latency or performance regressions, Deplora provides instant one-command rollback using MLflow model artifacts and Kubernetes replica history:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div style={{ background: '#07090e', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.85rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Rollback Model weights to previous version:</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <code style={{ color: '#f43f5e', fontSize: '0.82rem' }}>deplora rollback --target model</code>
                  <button onClick={() => copyToClipboard('deplora rollback --target model', 'rb1')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {copiedCmd === 'rb1' ? <Check size={13} color="var(--success)" /> : <Copy size={13} />}
                  </button>
                </div>
              </div>
              <div style={{ background: '#07090e', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.85rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Rollback entire Application stack:</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <code style={{ color: '#fb923c', fontSize: '0.82rem' }}>deplora rollback --target app</code>
                  <button onClick={() => copyToClipboard('deplora rollback --target app', 'rb2')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {copiedCmd === 'rb2' ? <Check size={13} color="var(--success)" /> : <Copy size={13} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Cloud Terraform Provisioning */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Cloud size={18} color="#34d399" /> Multi-Cloud Terraform Provisioning
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1rem' }}>
              Deplora generates and executes declarative Terraform manifests in <code>.deplora/generated/</code> for your chosen cloud:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <strong>AWS Cloud</strong>
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Amazon EKS + ECR + Karpenter GPU autoscaler + ALB Ingress.
                </p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <strong>GCP Cloud</strong>
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Google Kubernetes Engine (GKE) + Artifact Registry.
                </p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <strong>Azure Cloud</strong>
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Azure Kubernetes Service (AKS) + ACR container registry.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: CLI COMMANDS & REFERENCE
         ========================================================================= */}
      {activeGuideTab === 'cli' && (
        <div className="fade-in">
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Terminal size={20} color="var(--primary)" /> Complete CLI Command Reference
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              All CLI actions map 1:1 with REST endpoints powering this Web UI. You can use either the terminal or the dashboard interchangeably.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {[
                { cmd: 'deplora start [--port 8090]', desc: 'Starts the background engine daemon and opens the web dashboard.' },
                { cmd: 'deplora check', desc: 'Runs pre-flight verification on Docker, kubectl, Terraform, and cloud CLIs.' },
                { cmd: 'deplora analyze [DIR]', desc: 'Scans codebase, parses AST syntax, detects model weights and dependencies.' },
                { cmd: 'deplora generate', desc: 'Synthesizes Dockerfile.app, Dockerfile.model, and Kubernetes manifests.' },
                { cmd: 'deplora build', desc: 'Builds lightweight decoupled Docker images for application and model.' },
                { cmd: 'deplora deploy --mode full_app', desc: 'Executes the 12-stage deployment to cloud Kubernetes cluster.' },
                { cmd: 'deplora scale --target all -r 4', desc: 'Sets replica count for pods with zero downtime.' },
                { cmd: 'deplora test --text "sample"', desc: 'Sends an inference payload to the live prediction endpoint.' },
                { cmd: 'deplora logs --service model', desc: 'Streams live container stdout/stderr logs in real-time.' },
                { cmd: 'deplora rollback --target model', desc: 'Reverts the inference service to the previous verified model version.' },
                { cmd: 'deplora status', desc: 'Shows engine PID, active port, replica count, and telemetry metrics.' },
                { cmd: 'deplora stop', desc: 'Gracefully shuts down the background daemon and releases port.' },
              ].map((item, idx) => (
                <div key={idx} style={{
                  background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)',
                  borderRadius: '10px', padding: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <code style={{ color: '#38bdf8', fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: '700' }}>
                      {item.cmd}
                    </code>
                    <button
                      onClick={() => copyToClipboard(item.cmd, `c-${idx}`)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      {copiedCmd === `c-${idx}` ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: TROUBLESHOOTING & FAQ
         ========================================================================= */}
      {activeGuideTab === 'faq' && (
        <div className="fade-in">
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <HelpCircle size={20} color="var(--secondary)" /> Troubleshooting & Frequently Asked Questions
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Common issues and immediate solutions when running Deplora locally or in cloud environments:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* FAQ 1 */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.25rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#fbbf24', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={16} /> Why is the UI running on port 8090 instead of 8080?
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Port <strong>8080</strong> is the standard port for local Jenkins installations. When Deplora starts, it checks port availability. If port 8080 is already occupied by your Jenkins server, Deplora automatically chooses the next open port (e.g. <strong>8090</strong>) without failing, printing the exact URL in your terminal.
                </p>
              </div>

              {/* FAQ 2 */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.25rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#38bdf8', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Info size={16} /> What ML model formats does Deplora support?
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Deplora natively detects <code>.pkl</code> (Scikit-Learn/Joblib), <code>.pt</code>/<code>.pth</code> (PyTorch), <code>.h5</code>/SavedModel (TensorFlow/Keras), and <code>.onnx</code>. It generates model-serving code using standard MLflow/FastAPI containers.
                </p>
              </div>

              {/* FAQ 3 */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.25rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#4ade80', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} /> Can I run Deplora without an AWS account?
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Yes! Select <strong>"Local"</strong> in Conductor Studio. Deplora will deploy both microservices inside your local Docker daemon or local Kind (Kubernetes in Docker) cluster, allowing full testing without any cloud spend.
                </p>
              </div>

              {/* FAQ 4 */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.25rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#ec4899', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RotateCcw size={16} /> Where are generated Dockerfiles and Kubernetes YAML files stored?
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  All generated artifacts are written directly to <code>.deplora/generated/</code> inside your project directory. You can inspect or modify these files at any time, and Deplora will respect your custom edits on the next build!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Quick Actions Bar */}
      <div className="glass-panel" style={{
        marginTop: '2rem', padding: '1.25rem 1.75rem', borderRadius: '14px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="status-dot pulsing" style={{ background: 'var(--success)' }} />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>Ready to Deploy?</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Jump straight into Conductor Studio to run your first automated deployment.</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => onSwitchTab('conductor')}
            style={{
              padding: '0.6rem 1.25rem', borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
              border: 'none', color: '#fff', fontSize: '0.85rem', fontWeight: '700',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
            }}
          >
            <PlayCircle size={15} /> Open Conductor Studio →
          </button>
        </div>
      </div>

    </div>
  );
};

export default GuideWalkthrough;
