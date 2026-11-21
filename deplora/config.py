"""
Deplora Configuration Manager (Module 5)
Handles persistent and runtime configuration for projects and cloud settings.
Loads, validates, and stores project-specific deployment settings in .deplora/config.json.
"""

import json
import os
from pathlib import Path
from typing import Dict, Any, Optional

DEFAULT_CONFIG: Dict[str, Any] = {
    "project_name": "sample-ml-app",
    "cloud_provider": "AWS",
    "region": "us-east-1",
    "cluster_name": "deplora-cluster",
    "namespace": "deplora",
    "app_port": 8000,
    "model_port": 8081,
    "engine_port": 8080,
    "deployment_mode": "full_app",
    "canary_percentage": 10,
    "monitoring_enabled": True,
    "mlflow_enabled": True,
    "services": {
        "aws": {"connected": True, "provider": "AWS"},
        "docker": {"connected": True, "registry": "Amazon ECR"},
        "jenkins": {"connected": True, "url": "http://localhost:8080"},
        "kubernetes": {"connected": True, "context": "eks-cluster"},
        "mlflow": {"connected": True, "uri": "sqlite:///mlflow.db"}
    }
}


class ConfigManager:
    def __init__(self, target_dir: str | Path = "."):
        self.target_dir = Path(target_dir).resolve()
        self.deplora_dir = self.target_dir / ".deplora"
        self.config_path = self.deplora_dir / "config.json"

    def load_config(self) -> Dict[str, Any]:
        """Loads configuration from .deplora/config.json or returns defaults."""
        if self.config_path.exists():
            try:
                data = json.loads(self.config_path.read_text(encoding="utf-8"))
                merged = DEFAULT_CONFIG.copy()
                merged.update(data)
                return merged
            except Exception:
                pass
        config = DEFAULT_CONFIG.copy()
        config["project_name"] = self.target_dir.name
        return config

    def save_config(self, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Persists updated configuration to .deplora/config.json."""
        current = self.load_config()
        current.update(updates)
        self.deplora_dir.mkdir(parents=True, exist_ok=True)
        self.config_path.write_text(json.dumps(current, indent=2), encoding="utf-8")
        return current

    def get(self, key: str, default: Any = None) -> Any:
        config = self.load_config()
        return config.get(key, default)


def get_config_manager(target_dir: str | Path = ".") -> ConfigManager:
    return ConfigManager(target_dir)
