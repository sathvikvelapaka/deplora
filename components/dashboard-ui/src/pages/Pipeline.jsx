import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, CheckCircle2, Clock, AlertCircle, 
  Terminal, Download, GitBranch, Box, Server, ShieldCheck, Activity, ChevronRight, Copy
} from 'lucide-react';

const STAGES = [
  {
    id: 1,
    name: '1. Source & Model Ingestion',
    short: 'Source Ingest',
    icon: GitBranch,
    command: 'git status && python -m deplora.analyzer --dir .',
    desc: 'Scans repository, detects FastAPI framework and loads model artifact (sentiment_model.pkl).',
    duration: '1.2s',
    inputs: ['app.py', 'model/sentiment_model.pkl', 'requirements.txt'],
    outputs: ['deplora-manifest.json', 'ast-analysis.json'],
    defaultLogs: `[info] Scanning project repository at /Users/sathvikvelapaka/Desktop/deplora
[info] Detected Python 3.12 with FastAPI application framework
[info] Located model artifact: sentiment_model.pkl (Scikit-learn LogisticRegression)
[info] Verified prediction endpoint route: /predict
[done] Project analysis complete. Mode: Decoupled Microservice`
  },
  {
    id: 2,
    name: '2. Pre-flight Environment Check',
    short: 'Pre-flight',
    icon: ShieldCheck,
    command: 'python -m deplora.cli check',
    desc: 'Verifies Docker daemon, kubectl cluster context, Helm charts, and cloud CLI credentials.',
    duration: '0.8s',
    inputs: ['kubeconfig', 'docker.sock', 'aws credentials'],
    outputs: ['system-compatibility-report.json'],
    defaultLogs: `[check] Checking Docker engine... OK (v24.0.7)
[check] Checking Git CLI... OK (v2.39.5)
[check] Checking Kubectl CLI... OK (v1.29.3)
[check] Checking Terraform... OK (v1.7.5)
[check] Checking Cloud CLI (AWS/GCP/Azure)... OK
[done] All pre-flight dependency checks satisfied.`
  },
  {
    id: 3,
    name: '3. Dual Container Build',
    short: 'Containerize',
    icon: Box,
    command: 'docker build -t deplora-app:latest -f Dockerfile.app . && docker build -t deplora-model:latest -f Dockerfile.model .',
    desc: 'Builds independent lightweight FastAPI App Microservice and KServe/Inference Server containers.',
    duration: '3.4s',
    inputs: ['Dockerfile.app', 'Dockerfile.model', 'inference_server.py'],
    outputs: ['deplora-app:sha256', 'deplora-model:sha256'],
    defaultLogs: `[docker] Building App Microservice: Dockerfile.app
[docker] Step 1/5 : FROM python:3.12-slim
[docker] Step 2/5 : COPY requirements.txt . && pip install -r requirements.txt
[docker] Step 3/5 : Successfully built deplora-app:latest
[docker] Building Model Microservice: Dockerfile.model
[docker] Step 1/6 : Embedding sentiment_model.pkl into runtime container
[docker] Step 2/6 : Initializing Uvicorn inference server on port 8001
[done] Dual microservice container images compiled successfully.`
  },
  {
    id: 4,
    name: '4. Model Registry & @champion Tag',
    short: 'MLflow Register',
    icon: Activity,
    command: 'python -m deplora.connectors.mlflow --action register --model sentiment_model.pkl',
    desc: 'Registers model artifact in MLflow Tracking server and assigns @champion alias for zero-downtime serving.',
    duration: '1.5s',
    inputs: ['sentiment_model.pkl', 'metrics.json'],
    outputs: ['models:/sentiment_model@champion', 'run_id: 8f9b1c2d'],
    defaultLogs: `[mlflow] Connected to MLflow server at http://127.0.0.1:5000
[mlflow] Created new experiment: deplora-sentiment-analysis
[mlflow] Registered Model: 'sentiment-classifier' Version 3
[mlflow] Assigned production alias: @champion -> version 3
[done] Model registered. Rollback target: version 2 retained as @challenger.`
  },
  {
    id: 5,
    name: '5. Kubernetes GitOps Deployment',
    short: 'K8s Sync',
    icon: Server,
    command: 'kubectl apply -f .deplora/app-deployment.yaml -f .deplora/model-deployment.yaml',
    desc: 'Applies Kubernetes manifests, provisions Ingress, and attaches internal cluster DNS service discovery.',
    duration: '2.1s',
    inputs: ['app-deployment.yaml', 'model-deployment.yaml', 'ingress.yaml'],
    outputs: ['svc/deplora-app:8000', 'svc/deplora-model:8001'],
    defaultLogs: `[k8s] deployment.apps/deplora-app-deployment created
[k8s] service/deplora-app-service created (Port 8000)
[k8s] deployment.apps/deplora-model-deployment created
[k8s] service/deplora-model-service created (Port 8001)
[k8s] ingress.networking.k8s.io/deplora-ingress configured
[done] Pods running: 2/2 app-replicas, 2/2 model-replicas in namespace default.`
  },
  {
    id: 6,
    name: '6. Canary Verification & Drift Probe',
    short: 'Canary & Drift',
    icon: CheckCircle2,
    command: 'python -m deplora.runner --test-drift',
    desc: 'Runs synthetic inference tests against /predict and establishes Kolmogorov-Smirnov baseline telemetry.',
    duration: '1.9s',
    inputs: ['synthetic_requests.json'],
    outputs: ['latency: 14ms', 'drift_detected: false'],
    defaultLogs: `[verify] Sending 10 canary probe requests to http://localhost:8000/predict
[verify] HTTP 200 OK | Sample prediction: {"sentiment": "positive", "confidence": 0.88}
[telemetry] Average round-trip latency: 13.8ms
[telemetry] KS-statistic drift check: p-value 0.84 (> 0.05 threshold)
[done] Canary verification passed. 100% traffic promoted to active deployment.`
  }
];

const Pipeline = () => {
  const [activeStageId, setActiveStageId] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [completedStages, setCompletedStages] = useState([1, 2, 3, 4, 5, 6]);
  const [currentRunningStage, setCurrentRunningStage] = useState(null);
  const [logs, setLogs] = useState(STAGES[0].defaultLogs);
  const [copied, setCopied] = useState(false);

  const selectedStage = STAGES.find(s => s.id === activeStageId) || STAGES[0];

  const handleStageClick = (stage) => {
    setActiveStageId(stage.id);
    setLogs(stage.defaultLogs);
  };

  const handleRunPipeline = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCompletedStages([]);
    setCurrentRunningStage(1);
    setActiveStageId(1);
    setLogs(`[start] Starting Deplora CI/CD Automation Pipeline...\n`);

    let stageIdx = 1;

    const runNext = () => {
      if (stageIdx > STAGES.length) {
        setIsRunning(false);
        setCurrentRunningStage(null);
        setLogs(prev => prev + `\n[success] All 6 pipeline stages executed successfully! Production live.`);
        return;
      }

      const st = STAGES[stageIdx - 1];
      setCurrentRunningStage(stageIdx);
      setActiveStageId(stageIdx);
      setLogs(prev => prev + `\n>>> Executing Stage ${st.name}...\n` + st.defaultLogs + '\n');

      setTimeout(() => {
        setCompletedStages(prev => [...prev, stageIdx]);
        stageIdx++;
        runNext();
      }, 1200);
    };

    runNext();
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentRunningStage(null);
    setCompletedStages([1, 2, 3, 4, 5, 6]);
    setActiveStageId(1);
    setLogs(STAGES[0].defaultLogs);
  };

  const copyJenkinsfile = () => {
    const jfile = `pipeline {
  agent any
  stages {
    stage('Pre-flight Check') { steps { sh 'deplora check' } }
    stage('Analyze') { steps { sh 'deplora analyze' } }
    stage('Build Containers') { steps { sh 'docker-compose build' } }
    stage('Register Model') { steps { sh 'mlflow models register' } }
    stage('Deploy K8s') { steps { sh 'kubectl apply -f .deplora/' } }
    stage('Drift Probe') { steps { sh 'deplora monitor --drift-check' } }
  }
}`;
    navigator.clipboard.writeText(jfile);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>MLOps Continuous Delivery Pipeline</h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Automated end-to-end execution flow from Git commit to Kubernetes inference and drift telemetry.
          </p>
        </div>

        {/* Pipeline Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={handleRunPipeline}
            disabled={isRunning}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.55rem 1.25rem', borderRadius: '8px',
              background: isRunning ? 'rgba(139, 92, 246, 0.4)' : 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
              border: 'none', color: '#fff', fontWeight: '600', fontSize: '0.85rem',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px var(--primary-glow)'
            }}
          >
            <Play size={16} /> {isRunning ? `Running Stage ${currentRunningStage}...` : 'Run Pipeline'}
          </button>

          <button
            onClick={handleReset}
            className="glass-panel"
            title="Reset to completed state"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.55rem 0.9rem', borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)',
              color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer'
            }}
          >
            <RotateCcw size={15} /> Reset
          </button>

          <button
            onClick={copyJenkinsfile}
            className="glass-panel"
            title="Copy Jenkinsfile"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.55rem 0.9rem', borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)',
              color: '#38bdf8', fontSize: '0.85rem', cursor: 'pointer'
            }}
          >
            <Copy size={15} /> {copied ? 'Copied Jenkinsfile!' : 'Jenkinsfile'}
          </button>
        </div>
      </div>

      {/* Visual Pipeline Stages Stepper */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', position: 'relative' }}>
          {STAGES.map((stage) => {
            const isCompleted = completedStages.includes(stage.id);
            const isCurrent = currentRunningStage === stage.id;
            const isSelected = activeStageId === stage.id;
            const Icon = stage.icon;

            return (
              <div
                key={stage.id}
                onClick={() => handleStageClick(stage)}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  background: isSelected 
                    ? 'rgba(139, 92, 246, 0.15)' 
                    : isCurrent 
                      ? 'rgba(6, 182, 212, 0.15)' 
                      : 'rgba(255,255,255,0.03)',
                  border: isSelected 
                    ? '1px solid var(--primary)' 
                    : isCurrent 
                      ? '1px solid var(--secondary)' 
                      : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: isCurrent ? 'var(--secondary)' : isCompleted ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                  }}>
                    <Icon size={16} />
                  </div>

                  {isCompleted ? (
                    <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.75rem' }}>
                      <CheckCircle2 size={14} /> {stage.duration}
                    </span>
                  ) : isCurrent ? (
                    <span style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.75rem' }}>
                      <Clock size={14} className="spinning" /> Active
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Queued</span>
                  )}
                </div>

                <div style={{ marginTop: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Stage {stage.id}</span>
                  <strong style={{ fontSize: '0.85rem', color: isSelected ? 'var(--primary)' : '#fff', lineHeight: 1.2 }}>
                    {stage.short}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage Details & Terminal Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Left: Stage Spec Details */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '6px',
              background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
            }}>
              <selectedStage.icon size={16} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedStage.name}</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            {selectedStage.desc}
          </p>

          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              CLI Command Executed:
            </span>
            <code style={{
              display: 'block', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)',
              padding: '0.6rem 0.85rem', borderRadius: '6px', color: '#38bdf8', fontSize: '0.8rem',
              wordBreak: 'break-all'
            }}>
              {selectedStage.command}
            </code>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                Stage Inputs:
              </span>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                {selectedStage.inputs.map((inp, i) => <li key={i}>{inp}</li>)}
              </ul>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                Generated Artifacts:
              </span>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--success)' }}>
                {selectedStage.outputs.map((out, i) => <li key={i}>{out}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Live Execution Logs */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Pipeline Execution Console</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {isRunning ? 'Streaming stdout...' : 'Execution complete'}
            </span>
          </div>

          <pre style={{
            flex: 1,
            background: '#07090e',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1rem',
            margin: 0,
            fontSize: '0.78rem',
            color: '#a78bfa',
            fontFamily: 'monospace',
            overflowY: 'auto',
            maxHeight: '260px',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.5
          }}>
            {logs}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Pipeline;