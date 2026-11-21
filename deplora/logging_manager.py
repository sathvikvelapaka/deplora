"""
Deplora Logging Manager (Module 15)
Collects, aggregates, and retrieves logs across the local Deplora engine,
deployment pipeline stages, container execution, and live inference services.
"""

import time
from typing import Dict, Any, List, Optional
from collections import deque


class LoggingManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(LoggingManager, cls).__new__(cls)
            cls._instance.logs = deque(maxlen=1000)
            cls._instance._init_defaults()
        return cls._instance

    def _init_defaults(self):
        self.add_log("Deplora Engine initialized on developer machine.", level="INFO", source="engine")
        self.add_log("Observability scraper active; Prometheus & Grafana connected.", level="INFO", source="monitoring")

    def add_log(self, message: str, level: str = "INFO", source: str = "orchestrator", step: Optional[int] = None):
        """Adds a log entry with timestamp and structured metadata."""
        entry = {
            "timestamp": time.strftime("%H:%M:%S"),
            "date": time.strftime("%Y-%m-%d"),
            "level": level,
            "source": source,
            "step": step,
            "message": message
        }
        self.logs.append(entry)

    def get_logs(self, limit: int = 100, source: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieves formatted logs, optionally filtered by source."""
        result = list(self.logs)
        if source:
            result = [entry for entry in result if entry["source"] == source]
        return result[-limit:]

    def clear(self):
        """Clears stored logs."""
        self.logs.clear()


def get_logging_manager() -> LoggingManager:
    return LoggingManager()
