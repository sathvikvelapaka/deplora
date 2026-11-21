import React, { useState } from 'react';
import { 
  Server, Cpu, HardDrive, CheckCircle2, AlertCircle, Plus, Minus, 
  RefreshCw, Terminal, Download, Copy, Play, ShieldCheck, Layers, Eye
} from 'lucide-react';

const CLOUDS = {
  aws: {
    name: 'AWS EKS',
    region: 'us-west-2 (Oregon)',
    clusterName: 'deplora-prod-eks',
    k8sVersion: 'v1.29.4',
    cidr: '10.100.0.0/16',
    instanceType: 'm5.2xlarge',
    gpuType: 'g4dn.xlarge (1x T4)'
  },
  gcp: {
    name: 'GCP GKE',
    region: 'us-central1 (Iowa)',
    clusterName: 'deplora-prod-gke',
    k8sVersion: 'v1.29.3-gke.1',
    cidr: '10.128.0.0/14',
    instanceType: 'e2-standard-8',
    gpuType: 'a2-highgpu-1g (1x A100)'
  },
  azure: {
    name: 'Azure AKS',
    region: 'eastus (Virginia)',
    clusterName: 'deplora-prod-aks',
    k8sVersion: 'v1.29.2',
    cidr: '10.240.0.0/16',
    instanceType: 'Standard_D8s_v5',
    gpuType: 'Standard_NC4as_T4_v3'
  },
  local: {
    name: 'Local Minikube',
    region: 'localhost',
    clusterName: 'minikube',
    k8sVersion: 'v1.28.3',
    cidr: '192.168.49.0/24',
    instanceType: 'docker-host (8 core)',
    gpuType: 'None (CPU emulation)'
  }
};

const Infrastructure = () => {
  const [selectedCloud, setSelectedCloud] = useState('aws');
  const [gpuEnabled, setGpuEnabled] = useState(true);
  const [nodes, setNodes] = useState([
    { id: 'node-1', name: 'worker-cpu-01', role: 'Worker (CPU)', cpu: '38%', ram: '4.2 / 16 GB', status: 'Ready', cordoned: false },
    { id: 'node-2', name: 'worker-cpu-02', role: 'Worker (CPU)', cpu: '45%', ram: '5.8 / 16 GB', status: 'Ready', cordoned: false },
    { id: 'node-3', name: 'worker-cpu-03', role: 'Worker (CPU)', cpu: '22%', ram: '3.1 / 16 GB', status: 'Ready', cordoned: false },
    { id: 'node-4', name: 'worker-gpu-01', role: 'Worker (Inference GPU)', cpu: '64%', ram: '9.4 / 32 GB', status: 'Ready', cordoned: false },
  ]);

  const [tfModalOpen, setTfModalOpen] = useState(false);
  const [tfLogs, setTfLogs] = useState('');
  const [isApplyingTf, setIsApplyingTf] = useState(false);
  const [copied, setCopied] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  const cluster = CLOUDS[selectedCloud];

  const triggerNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 3000);
  };

  const handleAddNode = () => {
    const nextIdx = nodes.length + 1;
    const isGpu = gpuEnabled && nextIdx % 4 === 0;
    const newNode = {
      id: `node-${Date.now()}`,
      name: isGpu ? `worker-gpu-0${Math.floor(nextIdx/4)}` : `worker-cpu-0${nextIdx}`,
      role: isGpu ? 'Worker (Inference GPU)' : 'Worker (CPU)',
      cpu: `${Math.floor(Math.random() * 30 + 15)}%`,
      ram: `${(Math.random() * 4 + 2).toFixed(1)} / ${isGpu ? '32' : '16'} GB`,
      status: 'Ready',
      cordoned: false
    };
    setNodes([...nodes, newNode]);
    triggerNotice(`Added new node ${newNode.name} to ${cluster.name} cluster.`);
  };

  const handleRemoveNode = () => {
    if (nodes.length <= 1) {
      triggerNotice('Cluster requires at least 1 active worker node.');
      return;
    }
    const removed = nodes[nodes.length - 1];
    setNodes(nodes.slice(0, -1));
    triggerNotice(`Node ${removed.name} gracefully drained and decommissioned.`);
  };

  const toggleCordon = (id) => {
    setNodes(nodes.map(n => {
      if (n.id === id) {
        const nextCordoned = !n.cordoned;
        triggerNotice(`Node ${n.name} is now ${nextCordoned ? 'CORDONED (SchedulingDisabled)' : 'UNCORDONED (Ready)'}.`);
        return {
          ...n,
          cordoned: nextCordoned,
          status: nextCordoned ? 'SchedulingDisabled' : 'Ready'
        };
      }
      return n;
    }));
  };

  const generateTerraformHCL = () => {
    if (selectedCloud === 'aws') {
      return `module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  version         = "~> 19.0"
  cluster_name    = "${cluster.clusterName}"
  cluster_version = "1.29"

  vpc_id     = "vpc-0a8b9c7d"
  subnet_ids = ["subnet-1", "subnet-2", "subnet-3"]

  eks_managed_node_groups = {
    cpu_nodes = {
      min_size     = 1
      max_size     = 10
      desired_size = ${nodes.filter(n => !n.role.includes('GPU')).length}
      instance_types = ["${cluster.instanceType}"]
    }
    gpu_nodes = {
      min_size     = ${gpuEnabled ? 1 : 0}
      max_size     = 4
      desired_size = ${gpuEnabled ? nodes.filter(n => n.role.includes('GPU')).length : 0}
      instance_types = ["${cluster.gpuType}"]
    }
  }
}`;
    }
    return `# Deplora Multi-Cloud Kubernetes Terraform Manifest
module "kubernetes_cluster" {
  provider     = "${selectedCloud}"
  cluster_name = "${cluster.clusterName}"
  region       = "${cluster.region}"
  node_count   = ${nodes.length}
  version      = "${cluster.k8sVersion}"
}`;
  };

  const handleCopyTf = () => {
    navigator.clipboard.writeText(generateTerraformHCL());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunTerraformPlan = () => {
    setIsApplyingTf(true);
    setTfLogs('[init] Initializing Terraform cloud backend...\n');
    setTimeout(() => {
      setTfLogs(prev => prev + `[plan] Refreshing state for ${cluster.clusterName}...\n[plan] Plan: ${nodes.length} nodes desired, 0 to destroy.\n`);
      setTimeout(() => {
        setTfLogs(prev => prev + `[apply] Changes verified. Infrastructure state matches declared architecture.\n[done] Apply complete! Resources: 0 added, 0 changed, 0 destroyed.\n`);
        setIsApplyingTf(false);
      }, 1000);
    }, 600);
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>Cluster Infrastructure</h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Real-time topology, multi-cloud nodes, and automated Terraform provisioning.
          </p>
        </div>

        {/* Cloud Switcher Tabs */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '4px', border: '1px solid var(--border-color)' }}>
          {Object.entries(CLOUDS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setSelectedCloud(key)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                border: 'none',
                background: selectedCloud === key ? 'var(--primary)' : 'transparent',
                color: selectedCloud === key ? '#fff' : 'var(--text-muted)',
                fontWeight: selectedCloud === key ? '600' : '400',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {val.name}
            </button>
          ))}
        </div>
      </div>

      {actionNotice && (
        <div className="fade-in" style={{
          marginBottom: '1rem', padding: '0.65rem 1rem', borderRadius: '8px',
          background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8',
          color: '#38bdf8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          <CheckCircle2 size={16} /> {actionNotice}
        </div>
      )}

      {/* Cluster Overview Card */}
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Provider</span>
            <p style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0.2rem 0' }}>{cluster.name}</p>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{cluster.region}</span>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cluster ID / Name</span>
            <p style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0.2rem 0', fontFamily: 'monospace' }}>{cluster.clusterName}</p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>K8s {cluster.k8sVersion}</span>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Nodes</span>
            <p style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0.2rem 0' }}>{nodes.length} Nodes</p>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
              {nodes.filter(n => !n.cordoned).length} Active | {nodes.filter(n => n.role.includes('GPU')).length} GPU
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cluster Health</span>
            <p style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0.2rem 0', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={18} /> Healthy
            </p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>VPC CIDR: {cluster.cidr}</span>
          </div>
        </div>

        {/* Action Controls for Nodes & Terraform */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>Scale Worker Nodes:</span>
            <button
              onClick={handleRemoveNode}
              className="glass-panel"
              style={{
                width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '8px', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)'
              }}
              title="Remove node"
            >
              <Minus size={16} />
            </button>
            <span style={{ fontWeight: '700', fontSize: '1rem', minWidth: '24px', textAlign: 'center' }}>
              {nodes.length}
            </span>
            <button
              onClick={handleAddNode}
              className="glass-panel"
              style={{
                width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '8px', cursor: 'pointer', background: 'var(--primary)', color: '#fff', border: 'none'
              }}
              title="Add worker node"
            >
              <Plus size={16} />
            </button>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={gpuEnabled}
                onChange={(e) => setGpuEnabled(e.target.checked)}
                style={{ accentColor: 'var(--primary)' }}
              />
              Enable GPU Acceleration ({cluster.gpuType})
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setTfModalOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.5rem 1rem', borderRadius: '8px',
                background: 'rgba(139, 92, 246, 0.15)', border: '1px solid var(--primary)',
                color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer'
              }}
            >
              <Terminal size={16} /> Terraform Plan & HCL
            </button>
          </div>
        </div>
      </div>

      {/* Nodes Table */}
      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={18} color="var(--primary)" /> Active Cluster Nodes
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.75rem' }}>Node Identifier</th>
              <th style={{ padding: '0.75rem' }}>Assigned Role</th>
              <th style={{ padding: '0.75rem' }}>CPU Load</th>
              <th style={{ padding: '0.75rem' }}>Memory Allocated</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map(n => (
              <tr key={n.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontWeight: '500' }}>
                  {n.name}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span className={n.role.includes('GPU') ? 'badge badge-warning' : 'badge badge-primary'} style={{ fontSize: '0.75rem' }}>
                    {n.role}
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>{n.cpu}</td>
                <td style={{ padding: '0.75rem' }}>{n.ram}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{
                    color: n.cordoned ? 'var(--warning)' : 'var(--success)',
                    display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    <span style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: n.cordoned ? 'var(--warning)' : 'var(--success)'
                    }} />
                    {n.status}
                  </span>
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                  <button
                    onClick={() => toggleCordon(n.id)}
                    style={{
                      background: n.cordoned ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      border: `1px solid ${n.cordoned ? 'var(--success)' : 'var(--warning)'}`,
                      color: n.cordoned ? 'var(--success)' : 'var(--warning)',
                      padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    {n.cordoned ? 'Uncordon' : 'Cordon / Drain'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Terraform Inspector Modal */}
      {tfModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-panel fade-in" style={{
            width: '90%', maxWidth: '640px', background: '#0e121e',
            border: '1px solid var(--border-highlight)', borderRadius: '16px',
            padding: '1.75rem', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Terminal size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Terraform Infrastructure Harness</h3>
              </div>
              <button 
                onClick={() => setTfModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Generated HCL for <strong>{cluster.name}</strong> provisioning with {nodes.length} nodes:
            </p>

            <pre style={{
              background: '#07090e', border: '1px solid var(--border-color)',
              borderRadius: '8px', padding: '1rem', fontSize: '0.8rem',
              color: '#38bdf8', overflowX: 'auto', fontFamily: 'monospace'
            }}>
              {generateTerraformHCL()}
            </pre>

            {tfLogs && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.4rem 0' }}>Plan & Execution Output:</p>
                <pre style={{
                  background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)',
                  borderRadius: '6px', padding: '0.75rem', fontSize: '0.75rem',
                  color: '#4ade80', fontFamily: 'monospace', whiteSpace: 'pre-wrap'
                }}>
                  {tfLogs}
                </pre>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', gap: '0.75rem' }}>
              <button
                onClick={handleCopyTf}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.5rem 1rem', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)',
                  color: '#fff', fontSize: '0.85rem', cursor: 'pointer'
                }}
              >
                <Copy size={14} /> {copied ? 'Copied!' : 'Copy HCL'}
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  disabled={isApplyingTf}
                  onClick={handleRunTerraformPlan}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.5rem 1.25rem', borderRadius: '8px',
                    background: 'var(--primary)', border: 'none',
                    color: '#fff', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer'
                  }}
                >
                  <Play size={14} /> {isApplyingTf ? 'Running Plan...' : 'Simulate Plan & Validate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Infrastructure;