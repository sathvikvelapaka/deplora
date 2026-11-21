"""
Deplora Kubernetes Manifest Generator
Generates production-ready Kubernetes manifests for decoupled App & Model microservices,
including Canary traffic split, HPA autoscaling, and Service definitions.
"""

from typing import Dict, Any


class KubernetesGenerator:
    def __init__(self, analysis: Dict[str, Any]):
        self.analysis = analysis
        self.project_name = analysis.get("project_name", "ml-app").lower().replace("_", "-")
        self.models = analysis.get("models_detected", [])
        self.model_name = self.models[0]["name"] if self.models else "model.pkl"

    def generate_app_manifest(self) -> str:
        """Generates Kubernetes Deployment and Service for the Application microservice."""
        return f"""apiVersion: apps/v1
kind: Deployment
metadata:
  name: {self.project_name}-app
  namespace: deplora
  labels:
    app.kubernetes.io/name: {self.project_name}-app
    app.kubernetes.io/component: backend
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: {self.project_name}-app
  template:
    metadata:
      labels:
        app: {self.project_name}-app
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
      containers:
      - name: backend
        image: {self.project_name}-app:latest
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8000
          name: http
        env:
        - name: MODEL_SERVICE_URL
          value: "http://{self.project_name}-model:8080"
        - name: ENVIRONMENT
          value: "production"
        resources:
          requests:
            cpu: "100m"
            memory: "256Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 15
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: {self.project_name}-app
  namespace: deplora
  labels:
    app: {self.project_name}-app
spec:
  type: ClusterIP
  ports:
  - port: 8000
    targetPort: 8000
    name: http
  selector:
    app: {self.project_name}-app
"""

    def generate_model_manifest(self) -> str:
        """Generates Kubernetes Deployment and Service for ML Model Serving with Canary readiness."""
        return f"""apiVersion: apps/v1
kind: Deployment
metadata:
  name: {self.project_name}-model
  namespace: deplora
  labels:
    app.kubernetes.io/name: {self.project_name}-model
    app.kubernetes.io/component: model-serving
spec:
  replicas: 2
  selector:
    matchLabels:
      app: {self.project_name}-model
  template:
    metadata:
      labels:
        app: {self.project_name}-model
        version: v1.0
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
      containers:
      - name: model-serving
        image: {self.project_name}-model:v1.0
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8080
          name: inference
        env:
        - name: MODEL_PATH
          value: "/serving/models/{self.model_name}"
        resources:
          requests:
            cpu: "250m"
            memory: "512Mi"
          limits:
            cpu: "1000m"
            memory: "1Gi"
        livenessProbe:
          httpGet:
            path: /v1/models/model/ready
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 15
        readinessProbe:
          httpGet:
            path: /v1/models/model/ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: {self.project_name}-model
  namespace: deplora
  labels:
    app: {self.project_name}-model
spec:
  type: ClusterIP
  ports:
  - port: 8080
    targetPort: 8080
    name: inference
  selector:
    app: {self.project_name}-model
"""

    def generate_ingress_manifest(self) -> str:
        """Generates Ingress configuration routing traffic to decoupled services."""
        return f"""apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {self.project_name}-ingress
  namespace: deplora
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/proxy-read-timeout: "120"
spec:
  rules:
  - http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: {self.project_name}-app
            port:
              number: 8000
      - path: /v1/models
        pathType: Prefix
        backend:
          service:
            name: {self.project_name}-model
            port:
              number: 8080
"""

    def generate_kserve_manifest(self) -> str:
        """Generates cloud-native KServe v2 InferenceService manifest."""
        return f"""apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata:
  name: {self.project_name}-inference
  namespace: deplora
spec:
  predictor:
    canaryTrafficPercent: 10
    model:
      modelFormat:
        name: sklearn
      storageUri: "s3://deplora-models/{self.project_name}/v1/"
      resources:
        requests:
          cpu: "200m"
          memory: "512Mi"
        limits:
          cpu: "1000m"
          memory: "1Gi"
"""

