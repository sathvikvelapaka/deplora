"""
Deplora Environment & Tool Checker
Validates local dev environment, CLI tools, credential chains,
and provides automated tool installation / setup commands.
"""

import sys
import shutil
import subprocess
from typing import Dict, Any, List


def run_cmd(cmd: list[str]) -> tuple[bool, str]:
    try:
        proc = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=5
        )
        if proc.returncode == 0:
            return True, proc.stdout.strip().split("\n")[0]
        return False, proc.stderr.strip().split("\n")[0]
    except Exception as e:
        return False, str(e)


TOOL_SPECS = {
    "docker": {
        "name": "Docker",
        "cmd": ["docker", "--version"],
        "required": True,
        "category": "Containerization",
        "description": "Used to containerize application and ML model microservices.",
        "brew_pkg": "--cask docker",
        "install_guide": "Install Docker Desktop from https://www.docker.com/products/docker-desktop"
    },
    "git": {
        "name": "Git",
        "cmd": ["git", "--version"],
        "required": True,
        "category": "VCS",
        "description": "Used for code versioning and triggering GitOps sync.",
        "brew_pkg": "git",
        "install_guide": "Install via 'brew install git'"
    },
    "kubectl": {
        "name": "Kubectl",
        "cmd": ["kubectl", "version", "--client", "--output=json"],
        "required": True,
        "category": "Orchestration",
        "description": "Kubernetes CLI for deploying and managing cluster workloads.",
        "brew_pkg": "kubectl",
        "install_guide": "Install via 'brew install kubectl'"
    },
    "terraform": {
        "name": "Terraform",
        "cmd": ["terraform", "-version"],
        "required": False,
        "category": "Infrastructure as Code",
        "description": "Used for automated multi-cloud provisioning (AWS, GCP, Azure).",
        "brew_pkg": "terraform",
        "install_guide": "Install via 'brew install terraform'"
    },
    "helm": {
        "name": "Helm",
        "cmd": ["helm", "version", "--short"],
        "required": False,
        "category": "Package Manager",
        "description": "Kubernetes package manager for KServe, Argo, and MLflow.",
        "brew_pkg": "helm",
        "install_guide": "Install via 'brew install helm'"
    },
    "aws": {
        "name": "AWS CLI",
        "cmd": ["aws", "--version"],
        "required": False,
        "category": "Cloud Provider",
        "description": "Used for EKS, ECR, and IAM IRSA configuration.",
        "brew_pkg": "awscli",
        "install_guide": "Install via 'brew install awscli'"
    },
    "gcloud": {
        "name": "Google Cloud SDK",
        "cmd": ["gcloud", "--version"],
        "required": False,
        "category": "Cloud Provider",
        "description": "Used for GCP GKE and Artifact Registry.",
        "brew_pkg": "--cask google-cloud-sdk",
        "install_guide": "Install via 'brew install --cask google-cloud-sdk'"
    },
    "az": {
        "name": "Azure CLI",
        "cmd": ["az", "--version"],
        "required": False,
        "category": "Cloud Provider",
        "description": "Used for Azure AKS and ACR.",
        "brew_pkg": "azure-cli",
        "install_guide": "Install via 'brew install azure-cli'"
    }
}


def check_tools() -> Dict[str, Any]:
    results = {}
    all_required_met = True

    for key, spec in TOOL_SPECS.items():
        is_installed = shutil.which(spec["cmd"][0]) is not None
        version_str = "Not installed"
        if is_installed:
            ok, out = run_cmd(spec["cmd"])
            if ok:
                version_str = out
            else:
                version_str = "Installed (failed version check)"
        else:
            if spec["required"]:
                all_required_met = False

        results[key] = {
            "name": spec["name"],
            "installed": is_installed,
            "version": version_str,
            "required": spec["required"],
            "category": spec["category"],
            "description": spec["description"],
            "install_guide": spec["install_guide"],
            "brew_pkg": spec["brew_pkg"]
        }

    return {
        "all_required_met": all_required_met,
        "tools": results
    }


def get_missing_tools() -> List[Dict[str, Any]]:
    report = check_tools()
    missing = []
    for k, v in report["tools"].items():
        if not v["installed"]:
            missing.append(v)
    return missing


def setup_missing_tool(tool_key: str) -> Dict[str, Any]:
    """Attempts automated installation via Homebrew or provides command."""
    if tool_key not in TOOL_SPECS:
        return {"status": "error", "message": f"Unknown tool: {tool_key}"}

    spec = TOOL_SPECS[tool_key]
    has_brew = shutil.which("brew") is not None

    if has_brew and spec.get("brew_pkg"):
        cmd = ["brew", "install"] + spec["brew_pkg"].split()
        return {
            "status": "ready_to_install",
            "command": " ".join(cmd),
            "instructions": spec["install_guide"]
        }

    return {
        "status": "manual_action_required",
        "instructions": spec["install_guide"]
    }


if __name__ == "__main__":
    report = check_tools()
    print(f"Pre-flight Check: {'PASSED' if report['all_required_met'] else 'ACTION REQUIRED'}")
    for k, v in report["tools"].items():
        status = "✓" if v["installed"] else "✗"
        print(f"  [{status}] {v['name']}: {v['version']}")
