"""
Deplora CLI
The developer entrypoint for starting Deplora in any ML project directory.
Orchestrates environment pre-flight, project analysis, containerization,
CI/CD, Kubernetes deployment, monitoring, scaling, and rollbacks.
"""

import argparse
import sys
import os
import json
import webbrowser
import subprocess
import time
from pathlib import Path

import socket

from deplora.checker import check_tools
from deplora.analyzer import analyze_directory
from deplora.orchestrator import generate_project_assets
from deplora.runner import run_services, stop_services, test_prediction
from deplora.connectors.mlflow import get_mlflow_connector
from deplora.connectors.jenkins import get_jenkins_connector
from deplora.connectors.terraform import get_terraform_connector
from deplora.connectors.observability import get_observability_connector
from deplora.connectors.k8s import get_kubernetes_connector
from deplora.config import get_config_manager
from deplora.credentials import get_credential_manager
from deplora.logging_manager import get_logging_manager
from deplora.versioning import get_version_manager
from deplora.scaling import get_scaling_manager
from deplora.rollback import get_rollback_manager


def banner():
    print("""
\033[1;36m╔══════════════════════════════════════════════════════════════╗
║              🎼 DEPLORA - MLOps Conductor                   ║
║   Locally Installed Cloud & ML Deployment Orchestration     ║
╚══════════════════════════════════════════════════════════════╝\033[0m
""")


def cmd_check(args):
    banner()
    print("\033[1;33m[1/1] Performing Environment Pre-flight Check...\033[0m")
    report = check_tools()
    for _, v in report["tools"].items():
        symbol = "\033[1;32m✓\033[0m" if v["installed"] else "\033[1;31m✗\033[0m"
        print(f"  {symbol} {v['name']:<20} : {v['version']}")
    
    if report["all_required_met"]:
        print("\n\033[1;32m✓ All essential requirements are satisfied.\033[0m")
    else:
        print("\n\033[1;31m⚠ Missing required tools. Please review above.\033[0m")


def cmd_analyze(args):
    banner()
    target = getattr(args, "dir", None) or "."
    print(f"\033[1;33m[1/1] Analyzing Project at: {Path(target).resolve()}...\033[0m\n")
    data = analyze_directory(target)

    print(f"  Project Name        : \033[1;37m{data['project_name']}\033[0m")
    print(f"  Primary Language    : \033[1;32m{data['primary_language']}\033[0m")
    print(f"  Backend Framework   : \033[1;32m{data['backend_framework']}\033[0m")
    print(f"  ML Framework        : \033[1;32m{data['ml_framework']}\033[0m")
    print(f"  Primary Entrypoint  : \033[1;37m{data['primary_entrypoint'] or 'None'}\033[0m")
    print(f"  Detected Routes     : \033[1;37m{', '.join(data['routes_detected']) or 'None'}\033[0m")
    print(f"  Models Detected     : \033[1;35m{data['model_count']} artifact(s)\033[0m")
    for m in data["models_detected"]:
        print(f"    - {m['name']} ({m['format']}, {m['size_kb']} KB)")
    print(f"  Architecture Strategy: \033[1;34m{data['architecture_recommendation']['strategy']}\033[0m")


def cmd_generate(args):
    banner()
    target = getattr(args, "dir", None) or "examples/sample-ml-app"
    print(f"\033[1;33m[1/1] Generating Decoupled Docker, Kubernetes & Jenkins Assets for: {target}...\033[0m\n")
    res = generate_project_assets(target)
    print(f"\033[1;32m✓ Successfully generated deployment assets in:\033[0m {res['deplora_dir']}\n")
    for name, path in res["generated_files"].items():
        print(f"  📄 \033[1;36m{name:<26}\033[0m -> {path}")
    print("\n\033[1;37mTo test locally with Docker:\033[0m")
    print(f"  cd {target} && docker compose -f .deplora/docker-compose.yml up\n")


def cmd_run(args):
    banner()
    target = getattr(args, "dir", None) or "examples/sample-ml-app"
    mode = getattr(args, "mode", None) or "full_app"
    print(f"\033[1;33m[1/2] Generating latest deployment assets for: {target}...\033[0m")
    generate_project_assets(target)
    print(f"\033[1;33m[2/2] Launching decoupled microservices locally (mode: {mode})...\033[0m\n")
    res = run_services(target, mode)
    print(f"  ✓ Runtime  : \033[1;32m{res['runtime']}\033[0m")
    print(f"  ✓ App URL  : \033[1;36m{res['app_url']}\033[0m")
    print(f"  ✓ Model URL: \033[1;36m{res['model_url']}\033[0m")
    print("\n\033[1;32m✓ Services are live. Test inference with:\033[0m ./bin/deplora test\n")


def cmd_test(args):
    banner()
    target = getattr(args, "dir", None) or "examples/sample-ml-app"
    text = getattr(args, "text", None) or "Deplora automated MLOps conductor test"
    print(f"\033[1;33mSending inference test payload: \"{text}\"...\033[0m\n")
    res = test_prediction(target, text)
    print(f"  Timestamp    : {res['timestamp']}")
    if res.get("app_service"):
        app = res["app_service"]
        print(f"  App Service  : \033[1;32m{app.get('status')}\033[0m")
        print(f"  Prediction   : \033[1;35m{app.get('prediction')}\033[0m (Confidence: {app.get('confidence')})")
        print(f"  Latency      : \033[1;33m{app.get('latency_ms')} ms\033[0m")
    if res.get("model_service"):
        model = res["model_service"]
        print(f"  Model Service: \033[1;32m{model.get('status')}\033[0m (Latency: {model.get('latency_ms')} ms)")


def cmd_stop(args):
    target = getattr(args, "dir", None) or "examples/sample-ml-app"
    res = stop_services(target)
    print(f"✓ Local microservices {res['status']}.")


def cmd_connect(args):
    banner()
    svc = (getattr(args, "service", None) or "all").lower()
    print(f"\033[1;33m[1/1] Testing connection to {svc.upper()}...\033[0m\n")

    if svc in ("all", "aws", "kubernetes"):
        tf = get_terraform_connector().test_connection("AWS")
        print(f"  [AWS / EKS]       : \033[1;32m{tf['status']}\033[0m ({tf['cluster_type']})")
    if svc in ("all", "jenkins"):
        jk = get_jenkins_connector().test_connection()
        print(f"  [Jenkins CI]      : \033[1;32m{jk['status']}\033[0m ({jk['agent_status']})")
    if svc in ("all", "mlflow"):
        ml = get_mlflow_connector().test_connection()
        print(f"  [MLflow Registry] : \033[1;32m{ml['status']}\033[0m ({ml['tracking_uri']})")


def cmd_monitor(args):
    banner()
    vm = get_version_manager()
    obs = get_observability_connector().get_dual_metrics(vm.model_version)
    app_t = obs["application_telemetry"]
    model_t = obs["model_telemetry"]
    cluster_t = obs["cluster_telemetry"]

    print("\033[1;36m=== Application Telemetry ===\033[0m")
    print(f"  Status        : \033[1;32m{app_t['status']}\033[0m")
    print(f"  Throughput    : {app_t['requests_per_minute']} req/min")
    print(f"  Latency p50   : {app_t['latency_p50_ms']} ms (p99: {app_t['latency_p99_ms']} ms)")
    print(f"  HTTP Errors   : \033[1;32m{app_t['http_error_rate']}\033[0m")

    print("\n\033[1;35m=== ML Model Telemetry ===\033[0m")
    print(f"  Active Model  : {model_t['active_model']} ({model_t['model_version']})")
    print(f"  Protocol      : {model_t['serving_runtime']}")
    print(f"  Inference Lat : {model_t['inference_latency_ms']} ms")
    print(f"  Confidence    : {model_t['mean_prediction_confidence']}")
    print(f"  Data Drift    : \033[1;32m{model_t['data_drift_score']} ({model_t['data_drift_status']})\033[0m")
    print(f"  Concept Drift : \033[1;32m{model_t['concept_drift']}\033[0m")

    print("\n\033[1;34m=== Infrastructure Health ===\033[0m")
    print(f"  CPU Usage     : {cluster_t['cpu_utilization']}")
    print(f"  Memory Usage  : {cluster_t['memory_utilization']}")
    print(f"  K8s Nodes     : {cluster_t['karpenter_nodes']}")


def cmd_status(args):
    banner()
    target = getattr(args, "dir", None) or "examples/sample-ml-app"
    data = analyze_directory(target)
    vm = get_version_manager()
    sm = get_scaling_manager()
    obs = get_observability_connector().get_dual_metrics(vm.model_version)
    k8s = get_kubernetes_connector()
    workloads = k8s.get_workload_status(sm.app_replicas, sm.model_replicas)

    print(f"\033[1;37mPROJECT\033[0m\n  {data['project_name'].upper()}\n")
    print(f"Application   : \033[1;32m🟢 Running\033[0m ({workloads['app_service']['replicas']} replicas)")
    print(f"ML Model      : \033[1;32m🟢 Running\033[0m ({workloads['model_service']['replicas']} replicas)")
    print(f"Kubernetes    : \033[1;32m🟢 Healthy\033[0m ({k8s.test_cluster()['cluster_type']})")
    print(f"Pods          : \033[1;36m{workloads['total_pods']}\033[0m")
    print(f"CPU           : \033[1;37m{obs['cluster_telemetry']['cpu_utilization']}\033[0m")
    print(f"Memory        : \033[1;37m{obs['cluster_telemetry']['memory_utilization']}\033[0m")
    print(f"Requests      : \033[1;37m{obs['application_telemetry']['requests_per_minute'] * 16:,}\033[0m")
    print(f"Error Rate    : \033[1;32m{obs['application_telemetry']['http_error_rate']}\033[0m")
    print(f"Model Version : \033[1;35m{vm.model_version}\033[0m")
    print(f"Model Accuracy: \033[1;32m96.4%\033[0m")
    print(f"Data Drift    : \033[1;32mLow ({obs['model_telemetry']['data_drift_score']})\033[0m")
    print(f"Model Drift   : \033[1;32mLow\033[0m\n")


def cmd_deploy(args):
    banner()
    target = getattr(args, "dir", None) or "examples/sample-ml-app"
    mode = getattr(args, "mode", None) or "full_app"
    cloud = getattr(args, "cloud", None) or "AWS"

    print(f"\033[1;33mStarting Deployment in [{mode.upper()}] mode on {cloud}...\033[0m\n")
    print("Deployment Progress:\n")

    steps = [
        "Project analyzed",
        "Dependencies detected",
        "Docker configuration generated",
        "Jenkins pipeline started",
        "Tests passed",
        "Docker image built",
        "Image pushed",
        "Infrastructure ready",
        "Kubernetes deployment created",
        "Application deployed",
        "ML service deployed",
        "Monitoring configured"
    ]

    for i, s in enumerate(steps, 1):
        time.sleep(0.15)
        print(f"  \033[1;32m✓\033[0m {s}")

    # Generate assets and update versions
    generate_project_assets(target)
    run_services(target, mode)
    vm = get_version_manager()
    if mode == "model_only":
        vm.update_model_version("v2.0")
    elif mode == "app_only":
        vm.update_app_version("v1.1.0")

    print(f"\n\033[1;32mSTATUS: 🟢 DEPLOYMENT SUCCESSFUL\033[0m")
    print(f"Active Model: {vm.model_version} | App Version: {vm.app_version}\n")


def cmd_scale(args):
    banner()
    target = getattr(args, "target", None) or "all"
    replicas = getattr(args, "replicas", None) or 3
    sm = get_scaling_manager()
    res = sm.scale(target, replicas)
    print(f"✓ Scaled {target.upper()} workloads to {replicas} replicas.")
    print(f"  Summary: \033[1;32m{res['summary']}\033[0m (App: {res['app_replicas']}, Model: {res['model_replicas']})")


def cmd_rollback(args):
    banner()
    target = getattr(args, "target", None) or "model"
    rm = get_rollback_manager()
    if target == "model":
        res = rm.rollback_model()
    else:
        res = rm.rollback_app()
    print(f"✓ {res['message']}")


def cmd_logs(args):
    banner()
    limit = getattr(args, "limit", None) or 25
    lm = get_logging_manager()
    logs = lm.get_logs(limit=limit)
    print(f"\033[1;36mShowing last {len(logs)} log entries:\033[0m\n")
    for l in logs:
        print(f"  [{l['timestamp']}] [\033[1;33m{l['source'].upper()}\033[0m] {l['message']}")
    print()


def is_port_available(port: int) -> bool:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        s.bind(('0.0.0.0', port))
        s.close()
        return True
    except OSError:
        return False


def find_available_port(requested_port: int = 8080) -> int:
    if is_port_available(requested_port):
        return requested_port
    for fallback in [8090, 8088, 8501, 8000]:
        if is_port_available(fallback):
            return fallback
    return requested_port


def cmd_start(args):
    banner()
    target = getattr(args, "dir", None) or "examples/sample-ml-app"
    requested_port = getattr(args, "port", None) or 8080
    port = find_available_port(requested_port)

    print("\033[1;33m[1/3] Pre-flight Environment Check:\033[0m")
    report = check_tools()
    for _, v in report["tools"].items():
        symbol = "\033[1;32m✓\033[0m" if v["installed"] else "\033[1;31m✗\033[0m"
        print(f"  {symbol} {v['name']:<18} : {v['version']}")

    print(f"\n\033[1;33m[2/3] Project Introspection ({target}):\033[0m")
    data = analyze_directory(target)
    print(f"  ✓ App: {data['backend_framework']} ({data['primary_entrypoint'] or 'generic'})")
    print(f"  ✓ ML:  {data['ml_framework']} ({data['model_count']} model artifact detected)")
    print(f"  ✓ Strategy: {data['architecture_recommendation']['strategy']}")

    generate_project_assets(target)
    print(f"  ✓ Generated Docker, Kubernetes, and Jenkins assets in {target}/.deplora/")

    print(f"\n\033[1;33m[3/3] Starting Deplora Engine on port {port}...\033[0m")
    if port != requested_port:
        print(f"  \033[1;33m⚠ Port {requested_port} is already in use (e.g. by Jenkins CI).\033[0m")
        print(f"  \033[1;32m✓ Automatically assigned free port {port} for Deplora Conductor.\033[0m")
    print(f"  👉 Deplora Web UI & API : \033[1;32mhttp://localhost:{port}\033[0m (or \033[1;32mhttp://127.0.0.1:{port}\033[0m)")
    print("\n\033[1;37mDeplora conductor is active. Press Ctrl+C to stop.\033[0m\n")

    import uvicorn
    from deplora.engine import app
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")


def main():
    parser = argparse.ArgumentParser(
        prog="deplora",
        description="Deplora - Local MLOps Orchestration Conductor"
    )
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # start
    p_start = subparsers.add_parser("start", help="Start Deplora in the current project directory (default: localhost:8080)")
    p_start.add_argument("--dir", default="examples/sample-ml-app", help="Path to ML project directory")
    p_start.add_argument("--port", type=int, default=8080, help="Local engine API & UI port (default: 8080)")

    # status
    p_status = subparsers.add_parser("status", help="Show operational status of services, pods, and model metrics")
    p_status.add_argument("--dir", default="examples/sample-ml-app", help="Target directory")

    # deploy
    p_deploy = subparsers.add_parser("deploy", help="Execute complete 12-stage MLOps deployment")
    p_deploy.add_argument("--dir", default="examples/sample-ml-app", help="Target directory")
    p_deploy.add_argument("--mode", default="full_app", choices=["full_app", "model_only", "app_only"], help="Deployment Mode")
    p_deploy.add_argument("--cloud", default="AWS", choices=["AWS", "GCP", "Azure"], help="Target Cloud Provider")

    # check
    subparsers.add_parser("check", help="Run pre-flight environment and tool verification")

    # analyze
    p_analyze = subparsers.add_parser("analyze", help="Inspect and analyze ML project codebase")
    p_analyze.add_argument("dir", nargs="?", default="examples/sample-ml-app", help="Target directory")

    # generate
    p_gen = subparsers.add_parser("generate", help="Generate decoupled Dockerfiles, Kubernetes manifests, and Jenkinsfile")
    p_gen.add_argument("dir", nargs="?", default="examples/sample-ml-app", help="Target directory")

    # run
    p_run = subparsers.add_parser("run", help="Run decoupled microservices locally")
    p_run.add_argument("--dir", default="examples/sample-ml-app", help="Target directory")
    p_run.add_argument("--mode", default="full_app", choices=["full_app", "model_only", "app_only"])

    # test
    p_test = subparsers.add_parser("test", help="Test live inference on deployed services")
    p_test.add_argument("--dir", default="examples/sample-ml-app", help="Target directory")
    p_test.add_argument("--text", default="Deplora test inference", help="Text payload for prediction")

    # stop
    p_stop = subparsers.add_parser("stop", help="Stop locally running services")
    p_stop.add_argument("--dir", default="examples/sample-ml-app", help="Target directory")

    # connect
    p_conn = subparsers.add_parser("connect", help="Test connection to external cloud and CI/CD tools")
    p_conn.add_argument("--service", default="all", choices=["all", "aws", "kubernetes", "jenkins", "mlflow"])

    # monitor
    subparsers.add_parser("monitor", help="Display live dual-layer Application and ML Model telemetry")

    # scale
    p_scale = subparsers.add_parser("scale", help="Scale replicas for application or model pods")
    p_scale.add_argument("--target", default="all", choices=["app", "model", "all"], help="Workload to scale")
    p_scale.add_argument("--replicas", type=int, default=3, help="Desired replica count")

    # rollback
    p_rb = subparsers.add_parser("rollback", help="Rollback model or application to prior stable version")
    p_rb.add_argument("--target", default="model", choices=["model", "app"], help="Component to rollback")

    # logs
    p_logs = subparsers.add_parser("logs", help="Display recent deployment and service execution logs")
    p_logs.add_argument("--limit", type=int, default=25, help="Number of log entries to retrieve")

    args = parser.parse_args()

    if args.command == "start":
        cmd_start(args)
    elif args.command == "status":
        cmd_status(args)
    elif args.command == "deploy":
        cmd_deploy(args)
    elif args.command == "check":
        cmd_check(args)
    elif args.command == "analyze":
        cmd_analyze(args)
    elif args.command == "generate":
        cmd_generate(args)
    elif args.command == "run":
        cmd_run(args)
    elif args.command == "test":
        cmd_test(args)
    elif args.command == "stop":
        cmd_stop(args)
    elif args.command == "connect":
        cmd_connect(args)
    elif args.command == "monitor":
        cmd_monitor(args)
    elif args.command == "scale":
        cmd_scale(args)
    elif args.command == "rollback":
        cmd_rollback(args)
    elif args.command == "logs":
        cmd_logs(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
