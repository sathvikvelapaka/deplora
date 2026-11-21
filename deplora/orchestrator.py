"""
Deplora Orchestrator
Master execution engine that synthesizes project analysis, Docker generation,
Kubernetes manifests, and CI/CD connectors into a deployment bundle (.deplora/).
"""

import os
from pathlib import Path
from typing import Dict, Any

from deplora.analyzer import analyze_directory
from deplora.generators.docker import DockerGenerator
from deplora.generators.k8s import KubernetesGenerator
from deplora.connectors.jenkins import JenkinsConnector
from deplora.connectors.mlflow import get_mlflow_connector


class DeploraOrchestrator:
    def __init__(self, target_dir: str | Path):
        self.target_dir = Path(target_dir).resolve()
        if not self.target_dir.exists():
            raise FileNotFoundError(f"Project directory not found: {self.target_dir}")
        self.deplora_dir = self.target_dir / ".deplora"

    def generate_all_assets(self) -> Dict[str, Any]:
        """Analyzes the project and writes production-ready Docker, K8s, and Jenkins assets."""
        analysis = analyze_directory(str(self.target_dir))
        
        docker_gen = DockerGenerator(analysis)
        k8s_gen = KubernetesGenerator(analysis)
        jenkins_gen = JenkinsConnector()

        # Create output directories
        self.deplora_dir.mkdir(parents=True, exist_ok=True)
        k8s_dir = self.deplora_dir / "k8s"
        k8s_dir.mkdir(parents=True, exist_ok=True)

        # Generate Docker assets
        dockerfile_app = docker_gen.generate_app_dockerfile()
        dockerfile_model = docker_gen.generate_model_dockerfile()
        inference_code = docker_gen.generate_inference_server_code()
        docker_compose = docker_gen.generate_docker_compose()

        (self.deplora_dir / "Dockerfile.app").write_text(dockerfile_app)
        (self.deplora_dir / "Dockerfile.model").write_text(dockerfile_model)
        (self.deplora_dir / "inference_server.py").write_text(inference_code)
        (self.deplora_dir / "docker-compose.yml").write_text(docker_compose)

        # Generate Kubernetes assets
        app_k8s = k8s_gen.generate_app_manifest()
        model_k8s = k8s_gen.generate_model_manifest()
        ingress_k8s = k8s_gen.generate_ingress_manifest()
        kserve_k8s = k8s_gen.generate_kserve_manifest()

        (k8s_dir / "app-deployment.yaml").write_text(app_k8s)
        (k8s_dir / "model-deployment.yaml").write_text(model_k8s)
        (k8s_dir / "ingress.yaml").write_text(ingress_k8s)
        (k8s_dir / "kserve.yaml").write_text(kserve_k8s)

        # Generate Jenkins CI/CD pipeline
        jenkinsfile = jenkins_gen.generate_jenkinsfile(analysis["project_name"])
        (self.deplora_dir / "Jenkinsfile").write_text(jenkinsfile)

        return {
            "project_name": analysis["project_name"],
            "deplora_dir": str(self.deplora_dir),
            "generated_files": {
                "Dockerfile.app": str(self.deplora_dir / "Dockerfile.app"),
                "Dockerfile.model": str(self.deplora_dir / "Dockerfile.model"),
                "inference_server.py": str(self.deplora_dir / "inference_server.py"),
                "docker-compose.yml": str(self.deplora_dir / "docker-compose.yml"),
                "Jenkinsfile": str(self.deplora_dir / "Jenkinsfile"),
                "k8s/app-deployment.yaml": str(k8s_dir / "app-deployment.yaml"),
                "k8s/model-deployment.yaml": str(k8s_dir / "model-deployment.yaml"),
                "k8s/ingress.yaml": str(k8s_dir / "ingress.yaml"),
                "k8s/kserve.yaml": str(k8s_dir / "kserve.yaml"),
            },
            "contents": {
                "Dockerfile.app": dockerfile_app,
                "Dockerfile.model": dockerfile_model,
                "docker-compose.yml": docker_compose,
                "Jenkinsfile": jenkinsfile,
                "k8s_app": app_k8s,
                "k8s_model": model_k8s,
                "k8s_ingress": ingress_k8s
            }
        }


def generate_project_assets(target_dir: str = "examples/sample-ml-app") -> Dict[str, Any]:
    orch = DeploraOrchestrator(target_dir)
    return orch.generate_all_assets()


if __name__ == "__main__":
    res = generate_project_assets("examples/sample-ml-app")
    print(f"✓ Generated {len(res['generated_files'])} assets in {res['deplora_dir']}")
    for k in res["generated_files"]:
        print(f"  - {k}")
