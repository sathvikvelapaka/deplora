"""
Deplora Version Management (Module 16)
Maintains independent version lifecycles for Application microservices
and ML Model microservices, enabling model-only updates and application-only updates.
"""

from typing import Dict, Any, List
import time


class VersionManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(VersionManager, cls).__new__(cls)
            cls._instance.app_version = "v1.0.0"
            cls._instance.model_version = "v1.0"
            cls._instance.stable_model_version = "v1.0"
            cls._instance.stable_app_version = "v1.0.0"
            cls._instance.history: List[Dict[str, Any]] = [
                {
                    "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                    "type": "initial_deploy",
                    "app_version": "v1.0.0",
                    "model_version": "v1.0",
                    "status": "stable"
                }
            ]
        return cls._instance

    def update_model_version(self, new_version: str) -> Dict[str, Any]:
        """Deploys a new model version while retaining stable fallback."""
        self.stable_model_version = self.model_version
        self.model_version = new_version
        record = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "type": "model_update",
            "app_version": self.app_version,
            "model_version": new_version,
            "status": "deployed"
        }
        self.history.append(record)
        return record

    def update_app_version(self, new_version: str) -> Dict[str, Any]:
        """Deploys a new application version without modifying model version."""
        self.stable_app_version = self.app_version
        self.app_version = new_version
        record = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "type": "app_update",
            "app_version": new_version,
            "model_version": self.model_version,
            "status": "deployed"
        }
        self.history.append(record)
        return record

    def get_state(self) -> Dict[str, Any]:
        """Returns current version state."""
        return {
            "app_version": self.app_version,
            "model_version": self.model_version,
            "stable_model_version": self.stable_model_version,
            "stable_app_version": self.stable_app_version,
            "history": self.history
        }


def get_version_manager() -> VersionManager:
    return VersionManager()
