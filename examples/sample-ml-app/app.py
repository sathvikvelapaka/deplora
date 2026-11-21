from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
import os
from pathlib import Path

app = FastAPI(
    title="AI Sentiment Analysis API",
    description="Sample ML Application managed by Deplora",
    version="1.0.0"
)

MODEL_PATH = Path(os.getenv("MODEL_PATH", "model/sentiment_model.pkl"))
model = None

@app.on_event("startup")
def load_model():
    global model
    if MODEL_PATH.exists():
        with open(MODEL_PATH, "rb") as f:
            model = pickle.load(f)
        print(f"Loaded model from {MODEL_PATH}")
    else:
        print("Warning: Model file not found, running in fallback mode.")

class TextInput(BaseModel):
    text: str

class PredictionResponse(BaseModel):
    text: str
    prediction: str
    confidence: float
    model_version: str = "v1.0"

@app.get("/")
def home():
    return {
        "service": "AI Sentiment Analysis API",
        "status": "online",
        "model_loaded": model is not None,
        "endpoints": ["/health", "/predict"]
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_ready": model is not None
    }

@app.post("/predict", response_model=PredictionResponse)
def predict(input_data: TextInput):
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    text_len = len(input_data.text)
    pred = model.predict([[text_len]])[0]
    probs = model.predict_proba([[text_len]])[0]
    confidence = float(probs[pred])
    label = "Positive" if pred == 1 else "Negative"

    return PredictionResponse(
        text=input_data.text,
        prediction=label,
        confidence=round(confidence, 4)
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

