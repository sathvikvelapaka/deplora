"""
Unit tests for Deplora MLOps Conductor
Tests Pre-flight checking, Project Analyzer, Docker & K8s Generators,
Jenkins CI connector, MLflow logging, Observability, Config Manager,
Credential Manager, Kubernetes Workloads, Scaling, Versioning, Rollback,
and FastAPI engine endpoints.
"""

import pytest
import os
from pathlib import Path
from fastapi.testclient import TestClient

from deplora.checker import check_tools, get_missing_tools
from deplora.analyzer import analyze_directory
from deplora.generators.docker import DockerGenerator
from deplora.generators.k8s import KubernetesGenerator
from deplora.connectors.jenkins import get_jenkins_connector
from deplora.connectors.mlflow import get_mlflow_connector
from deplora.connectors.observability import get_observability_connector
from deplora.connectors.k8s import get_kubernetes_connector
from deplora.config import get_config_manager
from deplora.credentials import get_credential_manager
from deplora.logging_manager import get_logging_manager
from deplora.versioning import get_version_manager
from deplora.scaling import get_scaling_manager
from deplora.rollback import get_rollback_manager
from deplora.orchestrator import generate_project_assets
from deplora.runner import test_prediction as run_inference_test
from deplora.engine import app


def test_checker():
    report = check_tools()
    assert "tools" in report
    assert "all_required_met" in report
    assert "docker" in report["tools"]
    assert "git" in report["tools"]
    assert "kubectl" in report["tools"]
    assert report["tools"]["git"]["installed"] is True


def test_analyzer():
    res = analyze_directory("examples/sample-ml-app")
    assert res["project_name"] == "sample-ml-app"
    assert res["primary_language"] == "Python"
    assert res["backend_framework"] == "FastAPI"
    assert res["ml_framework"] == "Scikit-learn"
    assert len(res["models_detected"]) >= 1
    assert res["models_detected"][0]["name"] == "sentiment_model.pkl"
    assert res["primary_entrypoint"] == "app.py"
    assert "/predict" in res["routes_detected"]


def test_docker_generator():
    analysis = analyze_directory("examples/sample-ml-app")
    gen = DockerGenerator(analysis)
    
    app_docker = gen.generate_app_dockerfile()
    assert "FROM python:3.11-slim" in app_docker
    assert "appuser" in app_docker
    assert "uvicorn" in app_docker

    model_docker = gen.generate_model_dockerfile()
    assert "model-serving" in model_docker
    assert "sentiment_model.pkl" in model_docker

    compose = gen.generate_docker_compose()
    assert "app-service:" in compose
    assert "model-service:" in compose


def test_k8s_generator():
    analysis = analyze_directory("examples/sample-ml-app")
    gen = KubernetesGenerator(analysis)

    app_k8s = gen.generate_app_manifest()
    assert "kind: Deployment" in app_k8s
    assert "kind: Service" in app_k8s
    assert "sample-ml-app-app" in app_k8s

    model_k8s = gen.generate_model_manifest()
    assert "sample-ml-app-model" in model_k8s
    assert "port: 8080" in model_k8s

    ingress_k8s = gen.generate_ingress_manifest()
    assert "kind: Ingress" in ingress_k8s


def test_jenkins_generator():
    jk = get_jenkins_connector()
    jenkinsfile = jk.generate_jenkinsfile("sample-ml-app")
    assert "pipeline {" in jenkinsfile
    assert "DEPLOY_MODE" in jenkinsfile
    assert "stage('1. Pre-Flight & Introspection')" in jenkinsfile
    assert "stage('5. Kubernetes Canary Rollout')" in jenkinsfile


def test_mlflow_connector():
    ml = get_mlflow_connector()
    conn_res = ml.test_connection()
    assert "status" in conn_res

    reg_res = ml.register_model_version(
        "unit_test_model",
        "examples/sample-ml-app/model/sentiment_model.pkl",
        version_alias="champion"
    )
    assert reg_res["model_name"] == "unit_test_model"
    assert reg_res["alias"] == "champion"


def test_observability():
    obs = get_observability_connector().get_dual_metrics("v1.0")
    assert "application_telemetry" in obs
    assert "model_telemetry" in obs
    assert obs["model_telemetry"]["active_model"] == "sentiment_model.pkl"
    assert "data_drift_score" in obs["model_telemetry"]


def test_orchestrator():
    res = generate_project_assets("examples/sample-ml-app")
    assert len(res["generated_files"]) >= 8
    assert Path(res["generated_files"]["Dockerfile.app"]).exists()
    assert Path(res["generated_files"]["Dockerfile.model"]).exists()
    assert Path(res["generated_files"]["Jenkinsfile"]).exists()


def test_inference_evaluation():
    res = run_inference_test("examples/sample-ml-app", "Testing complete Deplora conductor build")
    assert "app_service" in res
    assert res["app_service"]["prediction"] in ("Positive", "Negative")
    assert res["app_service"]["confidence"] > 0.5


def test_config_manager(tmp_path):
    cfg_mgr = get_config_manager(tmp_path)
    cfg = cfg_mgr.load_config()
    assert "cloud_provider" in cfg
    assert cfg["cloud_provider"] == "AWS"
    updated = cfg_mgr.save_config({"cloud_provider": "GCP", "region": "us-central1"})
    assert updated["cloud_provider"] == "GCP"
    assert cfg_mgr.get("region") == "us-central1"


def test_credential_manager():
    cred_mgr = get_credential_manager()
    statuses = cred_mgr.get_all_statuses()
    assert "aws" in statuses
    assert "kubernetes" in statuses
    assert "docker" in statuses
    assert "jenkins" in statuses
    assert "mlflow" in statuses
    assert statuses["aws"]["secure"] is True


def test_k8s_workload_connector():
    k8s = get_kubernetes_connector()
    cluster_test = k8s.test_cluster()
    assert "status" in cluster_test
    workload = k8s.get_workload_status(app_replicas=3, model_replicas=3)
    assert workload["total_pods"] == "6 / 6"
    assert workload["app_service"]["replicas"] == 3


def test_logging_and_version_managers():
    logger = get_logging_manager()
    logger.add_log("Testing log entry", source="test_suite")
    logs = logger.get_logs(limit=5)
    assert len(logs) >= 1
    assert any("Testing log entry" in l["message"] for l in logs)

    vm = get_version_manager()
    initial_model_v = vm.model_version
    vm.update_model_version("v2.0")
    assert vm.model_version == "v2.0"
    assert vm.stable_model_version == initial_model_v

    rm = get_rollback_manager()
    rollback_res = rm.rollback_model()
    assert rollback_res["success"] is True
    assert rollback_res["active_version"] == "v1.0"


def test_scaling_manager():
    sm = get_scaling_manager()
    status = sm.scale("all", 4)
    assert status["app_replicas"] == 4
    assert status["model_replicas"] == 4
    assert status["total_pods"] == 8


def test_engine_api_endpoints():
    client = TestClient(app)
    
    resp_health = client.get("/api/health")
    assert resp_health.status_code == 200
    assert resp_health.json()["status"] == "ok"

    resp_status = client.get("/api/status")
    assert resp_status.status_code == 200
    data = resp_status.json()
    assert "pods" in data
    assert "model_version" in data

    resp_scale = client.post("/api/scale", json={"target": "all", "replicas": 3})
    assert resp_scale.status_code == 200
    assert resp_scale.json()["app_replicas"] == 3

    resp_logs = client.get("/api/logs?limit=5")
    assert resp_logs.status_code == 200
    assert "logs" in resp_logs.json()
