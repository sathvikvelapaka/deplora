"""
Deplora Docker Generator
Generates decoupled, production-grade Dockerfiles for:
1. Application Microservice (Backend API)
2. ML Model Microservice (KServe v2 compliant serving container)
3. Docker Compose orchestration for local testing
"""

from typing import Dict, Any
from pathlib import Path


class DockerGenerator:
    def __init__(self, analysis: Dict[str, Any]):
        self.analysis = analysis
        self.project_name = analysis.get("project_name", "ml-app")
        self.entrypoint = analysis.get("primary_entrypoint", "app.py")
        self.framework = analysis.get("backend_framework", "FastAPI")
        self.ml_framework = analysis.get("ml_framework", "Scikit-learn")
        self.models = analysis.get("models_detected", [])

    def generate_app_dockerfile(self) -> str:
        """Generates Dockerfile.app for backend API microservice."""
        entry_module = self.entrypoint.replace(".py", "") if self.entrypoint else "app"
        
        return f"""# ══════════════════════════════════════════════════════════════
# Deplora Generated Dockerfile - Application Microservice
# Decoupled Backend Service (Project: {self.project_name})
# ══════════════════════════════════════════════════════════════
FROM python:3.11-slim as base

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \\
    PYTHONDONTWRITEBYTECODE=1 \\
    PORT=8000 \\
    MODEL_SERVICE_URL="http://model-service:8080"

RUN apt-get update && apt-get install -y --no-install-recommends \\
    curl \\
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \\
    pip install --no-cache-dir -r requirements.txt

# Copy application source code (excluding heavy model weights)
COPY . .

# Run as non-root user for Pod Security Admission (PSA) compliance
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \\
    CMD curl -f http://localhost:8000/health || exit 1

# Start {self.framework} server
CMD ["uvicorn", "{entry_module}:app", "--host", "0.0.0.0", "--port", "8000"]
"""

    def generate_model_dockerfile(self) -> str:
        """Generates Dockerfile.model for dedicated ML model serving microservice."""
        model_name = self.models[0]["name"] if self.models else "model.pkl"
        
        return f"""# ══════════════════════════════════════════════════════════════
# Deplora Generated Dockerfile - ML Model Microservice
# High-Performance Serving Container (Model: {model_name})
# ══════════════════════════════════════════════════════════════
FROM python:3.11-slim as model-serving

WORKDIR /serving

ENV PYTHONUNBUFFERED=1 \\
    PORT=8080 \\
    MODEL_PATH="/serving/models/{model_name}"

RUN apt-get update && apt-get install -y --no-install-recommends \\
    curl \\
    && rm -rf /var/lib/apt/lists/*

# Install ML Serving runtime dependencies
RUN pip install --no-cache-dir \\
    fastapi==0.115.0 \\
    uvicorn==0.31.0 \\
    pydantic==2.9.2 \\
    numpy \\
    scikit-learn \\
    joblib

# Copy model artifacts
COPY model/ /serving/models/

# Inject standard KServe v2 data-plane inference runtime
COPY .deplora/inference_server.py /serving/inference_server.py

RUN useradd -m -u 1000 modeluser && chown -R modeluser:modeluser /serving
USER modeluser

EXPOSE 8080

HEALTHCHECK --interval=20s --timeout=5s --start-period=5s --retries=3 \\
    CMD curl -f http://localhost:8080/v1/models/model/ready || exit 1

CMD ["uvicorn", "inference_server:app", "--host", "0.0.0.0", "--port", "8080"]
"""

    def generate_inference_server_code(self) -> str:
        """Generates a standard KServe v2 compliant REST serving wrapper."""
        model_filename = self.models[0]["name"] if self.models else "model.pkl"
        
        return f'''"""
Deplora Standard Model Serving Runtime (KServe v2 Data Plane Compliant)
"""
import os
import pickle
import time
from pathlib import Path
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Any

app = FastAPI(title="Deplora ML Model Service", version="1.0.0")

MODEL_PATH = Path(os.getenv("MODEL_PATH", "/serving/models/{model_filename}"))
model = None

@app.on_event("startup")
def load_model():
    global model
    if MODEL_PATH.exists():
        with open(MODEL_PATH, "rb") as f:
            model = pickle.load(f)
        print(f"[Deplora] Successfully loaded ML Model artifact: {{MODEL_PATH}}")
    else:
        print(f"[Deplora] Warning: Model file not found at {{MODEL_PATH}}")

class InferenceRequest(BaseModel):
    inputs: List[Any]

@app.get("/v1/models/model/ready")
def ready():
    if model is None:
        raise HTTPException(status_code=503, detail="Model is not ready")
    return {{"name": "{model_filename}", "ready": True}}

@app.post("/v1/models/model:predict")
def predict(req: InferenceRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="Model is not ready")
    
    start_time = time.time()
    try:
        # Perform prediction
        preds = model.predict(req.inputs).tolist()
        latency_ms = round((time.time() - start_time) * 1000, 2)
        return {{
            "model_name": "{model_filename}",
            "model_version": "v1.0",
            "predictions": preds,
            "latency_ms": latency_ms
        }}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Inference error: {{str(e)}}")
'''

    def generate_docker_compose(self) -> str:
        """Generates docker-compose.deplora.yml for one-click local multi-container testing."""
        return f"""version: '3.8'

# ══════════════════════════════════════════════════════════════
# Deplora Local Decoupled Microservices Stack
# Run with: docker compose -f .deplora/docker-compose.yml up
# ══════════════════════════════════════════════════════════════

services:
  # 1. Backend Application Service
  app-service:
    build:
      context: ..
      dockerfile: .deplora/Dockerfile.app
    container_name: deplora-app
    ports:
      - "8000:8000"
    environment:
      - MODEL_SERVICE_URL=http://model-service:8080
      - ENVIRONMENT=local-dev
    networks:
      - deplora-net
    depends_on:
      - model-service

  # 2. ML Model Serving Service
  model-service:
    build:
      context: ..
      dockerfile: .deplora/Dockerfile.model
    container_name: deplora-model
    ports:
      - "8080:8080"
    environment:
      - ENVIRONMENT=local-dev
    networks:
      - deplora-net

networks:
  deplora-net:
    driver: bridge
"""

