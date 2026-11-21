"""
Deplora Project Analyzer
Scans an ML application repository, detecting code languages, backend frameworks,
ML libraries, model artifacts, dependencies, and entrypoints.
"""

import os
from pathlib import Path
from typing import Dict, Any, List


class ProjectAnalyzer:
    def __init__(self, target_dir: str | Path):
        self.target_dir = Path(target_dir).resolve()
        if not self.target_dir.exists():
            raise FileNotFoundError(f"Directory not found: {self.target_dir}")

    def scan(self) -> Dict[str, Any]:
        files = self._list_files()
        language = self._detect_language(files)
        deps = self._detect_dependencies(files)
        ml_frameworks = self._detect_ml_frameworks(files, deps)
        backend_frameworks = self._detect_backend_frameworks(files, deps)
        models = self._detect_models(files)
        entrypoints = self._detect_entrypoints(files)
        routes = self._detect_routes(entrypoints)

        return {
            "project_name": self.target_dir.name,
            "project_path": str(self.target_dir),
            "primary_language": language,
            "backend_framework": backend_frameworks[0] if backend_frameworks else "Generic Python",
            "backend_frameworks": backend_frameworks,
            "ml_framework": ml_frameworks[0] if ml_frameworks else "None Detected",
            "ml_frameworks": ml_frameworks,
            "models_detected": models,
            "model_count": len(models),
            "entrypoints": entrypoints,
            "primary_entrypoint": entrypoints[0]["relative_path"] if entrypoints else None,
            "routes_detected": routes,
            "dependencies": deps,
            "architecture_recommendation": self._generate_recommendation(
                backend_frameworks, ml_frameworks, models
            )
        }

    def _list_files(self) -> List[Path]:
        ignore_dirs = {
            ".git", ".venv", "venv", "node_modules", "__pycache__", 
            ".pytest_cache", ".hypothesis", ".ruff_cache", "dist", "build", ".terraform"
        }
        all_files = []
        for root, dirs, files in os.walk(self.target_dir):
            dirs[:] = [d for d in dirs if d not in ignore_dirs]
            for file in files:
                all_files.append(Path(root) / file)
        return all_files

    def _detect_language(self, files: List[Path]) -> str:
        counts = {"Python": 0, "JavaScript/TypeScript": 0, "Go": 0, "Java": 0}
        for f in files:
            ext = f.suffix.lower()
            if ext == ".py":
                counts["Python"] += 1
            elif ext in (".js", ".jsx", ".ts", ".tsx"):
                counts["JavaScript/TypeScript"] += 1
            elif ext == ".go":
                counts["Go"] += 1
            elif ext in (".java", ".kt"):
                counts["Java"] += 1

        best = max(counts, key=counts.get)
        return best if counts[best] > 0 else "Unknown"

    def _detect_dependencies(self, files: List[Path]) -> Dict[str, Any]:
        deps_info = {"files": [], "packages": []}
        req_file = self.target_dir / "requirements.txt"
        if req_file.exists():
            deps_info["files"].append("requirements.txt")
            try:
                with open(req_file, "r", encoding="utf-8", errors="ignore") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#"):
                            pkg = line.split("==")[0].split(">=")[0].split("<=")[0].strip()
                            deps_info["packages"].append(pkg.lower())
            except Exception:
                pass

        pyproject = self.target_dir / "pyproject.toml"
        if pyproject.exists():
            deps_info["files"].append("pyproject.toml")

        return deps_info

    def _detect_backend_frameworks(self, files: List[Path], deps: Dict[str, Any]) -> List[str]:
        frameworks = []
        pkgs = deps.get("packages", [])
        
        # Check requirements first
        if "fastapi" in pkgs:
            frameworks.append("FastAPI")
        if "flask" in pkgs:
            frameworks.append("Flask")
        if "django" in pkgs:
            frameworks.append("Django")
        if "streamlit" in pkgs:
            frameworks.append("Streamlit")
        if "gradio" in pkgs:
            frameworks.append("Gradio")

        # Code inspection
        for f in files:
            if f.suffix == ".py":
                try:
                    content = f.read_text(encoding="utf-8", errors="ignore")
                    if "from fastapi" in content or "import fastapi" in content:
                        if "FastAPI" not in frameworks:
                            frameworks.append("FastAPI")
                    if "from flask" in content or "import flask" in content:
                        if "Flask" not in frameworks:
                            frameworks.append("Flask")
                    if "import streamlit" in content:
                        if "Streamlit" not in frameworks:
                            frameworks.append("Streamlit")
                    if "import gradio" in content:
                        if "Gradio" not in frameworks:
                            frameworks.append("Gradio")
                except Exception:
                    pass
        return frameworks

    def _detect_ml_frameworks(self, files: List[Path], deps: Dict[str, Any]) -> List[str]:
        ml_map = {
            "torch": "PyTorch",
            "pytorch": "PyTorch",
            "torchvision": "PyTorch",
            "tensorflow": "TensorFlow",
            "keras": "Keras",
            "sklearn": "Scikit-learn",
            "scikit-learn": "Scikit-learn",
            "transformers": "HuggingFace Transformers",
            "xgboost": "XGBoost",
            "lightgbm": "LightGBM",
            "onnx": "ONNX",
            "onnxruntime": "ONNX Runtime",
            "vllm": "vLLM",
        }
        detected = []
        for pkg in deps.get("packages", []):
            if pkg in ml_map and ml_map[pkg] not in detected:
                detected.append(ml_map[pkg])

        for f in files:
            if f.suffix == ".py":
                try:
                    content = f.read_text(encoding="utf-8", errors="ignore")
                    for token, name in [
                        ("import torch", "PyTorch"),
                        ("import sklearn", "Scikit-learn"),
                        ("from sklearn", "Scikit-learn"),
                        ("import tensorflow", "TensorFlow"),
                        ("from transformers import", "HuggingFace Transformers"),
                        ("import xgboost", "XGBoost"),
                        ("import onnx", "ONNX"),
                    ]:
                        if token in content and name not in detected:
                            detected.append(name)
                except Exception:
                    pass
        return detected

    def _detect_models(self, files: List[Path]) -> List[Dict[str, Any]]:
        model_exts = {
            ".pkl": "Pickle / Scikit-learn",
            ".joblib": "Joblib / Scikit-learn",
            ".pt": "PyTorch State Dict",
            ".pth": "PyTorch Checkpoint",
            ".bin": "PyTorch / Transformers Bin",
            ".onnx": "ONNX Runtime Model",
            ".safetensors": "SafeTensors Weights",
            ".h5": "HDF5 / Keras Model",
        }
        models = []
        for f in files:
            ext = f.suffix.lower()
            if ext in model_exts:
                size_kb = round(f.stat().st_size / 1024, 2)
                rel_path = str(f.relative_to(self.target_dir))
                models.append({
                    "name": f.name,
                    "relative_path": rel_path,
                    "format": model_exts[ext],
                    "extension": ext,
                    "size_kb": size_kb,
                })
        return models

    def _detect_entrypoints(self, files: List[Path]) -> List[Dict[str, Any]]:
        common_entry_names = {"app.py", "main.py", "server.py", "api.py", "inference.py", "predict.py"}
        entrypoints = []
        for f in files:
            if f.name.lower() in common_entry_names:
                entrypoints.append({
                    "filename": f.name,
                    "relative_path": str(f.relative_to(self.target_dir)),
                    "path": str(f)
                })
        return entrypoints

    def _detect_routes(self, entrypoints: List[Dict[str, Any]]) -> List[str]:
        routes = set()
        for ep in entrypoints:
            try:
                content = Path(ep["path"]).read_text(encoding="utf-8", errors="ignore")
                for line in content.split("\n"):
                    line = line.strip()
                    if any(dec in line for dec in ["@app.get", "@app.post", "@app.route", "@router."]):
                        if "(" in line and ")" in line:
                            route_part = line.split("(")[1].split(")")[0].replace('"', "").replace("'", "")
                            routes.add(route_part.split(",")[0].strip())
            except Exception:
                pass
        return sorted(list(routes))

    def _generate_recommendation(
        self, backend: List[str], ml: List[str], models: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        return {
            "strategy": "Microservice Decoupling",
            "app_container": {
                "base_image": "python:3.11-slim",
                "framework": backend[0] if backend else "FastAPI",
                "recommended_port": 8000
            },
            "model_container": {
                "serving_runtime": "KServe v2 Data Plane" if "ONNX" in ml else "Custom ML Serving Container",
                "detected_artifacts": [m["name"] for m in models],
                "recommended_protocol": "REST /v1/models/<model>:predict",
                "recommended_port": 8080
            },
            "canary_strategy": "10% traffic canary split with automated rollback on error rate > 1%"
        }


def analyze_directory(path: str = ".") -> Dict[str, Any]:
    analyzer = ProjectAnalyzer(path)
    return analyzer.scan()


if __name__ == "__main__":
    import json
    res = analyze_directory(".")
    print(json.dumps(res, indent=2))

