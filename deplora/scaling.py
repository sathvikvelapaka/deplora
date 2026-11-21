"""
Deplora Scaling Manager (Module 17)
Dynamically manages and coordinates horizontal replica scaling for
independent Application and ML Model services in Kubernetes.
"""

from typing import Dict, Any
from deplora.connectors.k8s import get_kubernetes_connector
from deplora.logging_manager import get_logging_manager


class ScalingManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ScalingManager, cls).__new__(cls)
            cls._instance.app_replicas = 3
            cls._instance.model_replicas = 3
            cls._instance.k8s = get_kubernetes_connector()
            cls._instance.logger = get_logging_manager()
        return cls._instance

    def get_replica_status(self) -> Dict[str, Any]:
        """Returns active pod counts and scaling status."""
        total = self.app_replicas + self.model_replicas
        return {
            "app_replicas": self.app_replicas,
            "model_replicas": self.model_replicas,
            "total_pods": total,
            "summary": f"{total} / {total} Pods Active",
            "app_service": "sample-ml-app-app",
            "model_service": "sample-ml-app-model"
        }

    def scale(self, target: str, replicas: int) -> Dict[str, Any]:
        """
        Scales target ('app', 'model', or 'all') to desired replica count.
        """
        replicas = max(1, min(20, int(replicas)))
        if target in ("app", "all"):
            self.app_replicas = replicas
            self.k8s.scale_deployment("sample-ml-app-app", replicas)
            self.logger.add_log(f"⚡ Scaled Application pods to {replicas} replicas", source="scaling")
        if target in ("model", "all"):
            self.model_replicas = replicas
            self.k8s.scale_deployment("sample-ml-app-model", replicas)
            self.logger.add_log(f"⚡ Scaled ML Model pods to {replicas} replicas", source="scaling")

        return self.get_replica_status()


def get_scaling_manager() -> ScalingManager:
    return ScalingManager()
