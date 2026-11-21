# Deplora – Complete Beginner‑to‑Advanced Guide

## 📖 Overview
**Deplora** is a locally‑installed MLOps automation tool.  It helps a developer take an existing ML application, generate the necessary Docker/K8s artifacts, run CI/CD pipelines (via Jenkins), and deploy the app & model to a cloud provider – all from a simple CLI and a web UI.

---

## 🛠️ Prerequisites
| Requirement | Why it’s needed | Install command |
|---|---|---|
| **Python 3.10+** | Runtime for Deplora engine | `python3 -m venv .venv && source .venv/bin/activate` |
| **pip** | Package manager | `pip install --upgrade pip` |
| **Docker Engine** | Build & run container images | Follow Docker’s official installer for macOS |
| **kubectl** | Talk to a local or remote Kubernetes cluster | `brew install kubectl` |
| **Terraform** | Provision cloud resources (AWS, GCP, Azure) | `brew install terraform` |
| **AWS CLI** (or other cloud CLI) | Authenticate to the chosen cloud | `brew install awscli` |
| **Jenkins** (optional, but already present on your machine) | CI/CD pipeline runner used by Deplora | `brew install jenkins-lts` |
| **Git** | Source‑code checkout | `brew install git` |

> **Tip** – The first time you run `deplora start` it will perform a *pre‑flight check* and tell you which of the above are missing.

---

## 🚀 Quick‑Start (Beginner)
1. **Clone the repository** (if you haven’t already)
   ```bash
   git clone https://github.com/your‑org/deplora.git
   cd deplora
   ```
2. **Install Deplora in editable mode**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -e .
   ```
3. **Start the Deplora engine**
   ```bash
   ./bin/deplora start          # no port means “pick a free one”
   ```
   - The engine will detect that port 8080 is taken by Jenkins and will automatically bind to the next free port (e.g. **8090**).
   - You will see a log line similar to:
     ```
     INFO: Deplora engine listening on http://127.0.0.1:8090
     ```
4. **Open the UI**
   - Open your web browser and go to the URL printed in the log, e.g. `http://localhost:8090`.
   - The sidebar now shows the exact address, so you can copy‑paste it.
5. **Load a sample project**
   - In the UI click **“Add Project”** → point to a directory that contains an ML app (e.g. `examples/sample-ml-app`).
   - Deplora will run a *Project Analyzer* and fill a summary panel:
     - Language, framework, dependencies, model file, existing Dockerfile/K8s manifests, etc.
6. **Deploy with one click**
   - Choose the desired cloud (AWS is pre‑selected).  Click **“Deploy”**.
   - Deplora creates a Jenkins pipeline on the fly, builds the Docker image, pushes it to ECR (or a local registry), runs `terraform apply`, and finally creates the Kubernetes deployment.
7. **Verify**
   - The UI shows a 12‑step progress bar.  When it reaches **✅ Completed** you can click **“Open Service”** to view the running app.

---

## ⚙️ Intermediate Usage
### 1. CLI‑only workflow (no UI)
```bash
# Analyse the project and generate assets under .deplora/
./bin/deplora analyze /path/to/your/app

# Build Docker image (uses generated Dockerfile)
./bin/deplora build --project /path/to/your/app

# Deploy to a cloud (default AWS) – you can also specify GCP or Azure
./bin/deplora deploy --project /path/to/your/app --cloud AWS
```
### 2. Deploy modes
| Mode | What it does |
|---|---|
| `full_app` (default) | Deploy both the API/web service **and** the ML model as separate K8s Deployments. |
| `app_only` | Deploy only the application container (useful when the model is already served elsewhere). |
| `model_only` | Deploy only the model serving container (e.g. TorchServe, TensorFlow Serving). |

```bash
./bin/deplora deploy --mode app_only   # only backend service
./bin/deplora deploy --mode model_only # only model server
```
### 3. Scaling
```bash
# Scale *both* app and model to 4 replicas each
./bin/deplora scale --target all --replicas 4

# Scale only the model service
./bin/deplora scale --target model --replicas 2
```
The UI reflects the new replica count in real‑time.
### 4. Testing inference locally
```bash
./bin/deplora test --project /path/to/app \
    --text "Give me a short summary of the Eiffel Tower"
```
You’ll see the model’s response printed and also streamed to the UI‑log pane.
### 5. Viewing logs
```bash
./bin/deplora logs --service app   # tail the app container logs
./bin/deplora logs --service model # tail the model container logs
```
Or click **“View Logs”** in the UI.

---

## 🚧 Advanced Topics
### 1. Custom Dockerfile / K8s manifests
- Deplora generates files under `.deplora/generated/`.
- Edit `Dockerfile` or `deployment.yaml` as you like, then re‑run `./bin/deplora build` or `./bin/deplora deploy`.
### 2. Connect to an existing Jenkins server
```bash
./bin/deplora connect --service jenkins --url http://localhost:8080
```
Deplora will create a new pipeline job named `deplora‑<project‑name>`.
### 3. Rolling back
```bash
# Roll back the last successful deployment of the model
./bin/deplora rollback --target model

# Roll back the whole application stack
./bin/deplora rollback --target app
```
Deplora uses the image tags stored in the `deployment.yaml` and MLflow model version history to revert.
### 4. Multi‑cloud support
- Add a new cloud profile in `~/.deplora/clouds.yaml`:
  ```yaml
  GCP:
    project: my‑gcp‑project
    region: us‑central1
  Azure:
    subscription_id: <id>
    resource_group: deplora-rg
  ```
- Deploy with `--cloud GCP` or `--cloud Azure`.
### 5. Overriding the auto‑selected port
If you want a specific port, pass `--port` when starting:
```bash
./bin/deplora start --port 8200   # fails fast if 8200 is busy
```
If the port is taken, Deplora will print a warning and fall back to the next free port.
### 6. Stopping the engine
```bash
./bin/deplora stop               # graceful shutdown
# or press Ctrl‑C in the terminal where it was started
```
The daemon task (`task‑213`) will disappear from `manage_task list`.
---

## 🐞 Troubleshooting
| Symptom | Likely cause | Fix |
|---|---|---|
| **UI cannot connect** (blank page) | Engine not running or port blocked | Run `./bin/deplora status`; if not running, start it again. Verify no other process uses the shown port (`lsof -i :8090`). |
| **PermissionError reading `~/.aws/credentials`** | The file exists but is not readable by the current user. | Either fix the file permissions (`chmod 600 ~/.aws/credentials`) or set AWS credentials via environment variables (`export AWS_ACCESS_KEY_ID=…`). Deplora will fall back to env vars. |
| **Docker build fails – “cannot find requirements.txt”** | Project analyzer didn’t locate the file because it’s named differently. | Rename the dependency file to `requirements.txt` or create a `setup.cfg`/`pyproject.toml`. You can also provide a custom path via `--requirements path/to/file`. |
| **Jenkins pipeline never finishes** | Jenkins job stuck on a credential prompt. | Ensure the Jenkins user has permission to pull from the container registry (ECR) and that the AWS credentials are configured in Jenkins (`Manage Jenkins → Configure System`). |
| **Port 8080 already in use** | Jenkins (or another service) is bound to 8080. | Deplora automatically picks the next free port (e.g., 8090). The exact URL is printed in the log and shown in the UI sidebar. |
| **Kubernetes resources not created** | Terraform failed or you lack `kubectl` context. | Run `./bin/deplora terraform-apply` manually to see the error, and fix the AWS IAM role / kubeconfig. |
---

## 📚 FAQ
**Q:** *Do I need to run Jenkins separately?*  
**A:** Deplora uses the Jenkins installation already on your machine. If Jenkins is not installed, Deplora will spin up a lightweight `jenkins` Docker container automatically.

**Q:** *Can I use Deplora without a cloud provider?*  
**A:** Yes – choose **“Local”** in the UI. Deplora will deploy to a local Kind cluster (Docker‑in‑Docker) and use a local Docker registry.

**Q:** *Where does Deplora store generated files?*  
**A:** All artefacts are under the project’s `.deplora/` folder (`generated/`, `pipeline/`, `state.json`).  Commit this folder to git if you want reproducibility.

---

## 📂 Where to Find This Guide
The full guide lives at:
[GETTING_STARTED.md](file:///Users/sathvikvelapaka/Desktop/deplora/docs/GETTING_STARTED.md)

Feel free to open it in your editor, edit for your own workflow, and share it with teammates.

---

*That’s it! You now have a complete, beginner‑to‑advanced roadmap for using Deplora.*
