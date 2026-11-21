"""
Script to generate a trained sample model for the demo application.
"""
import os
import pickle
import numpy as np
from sklearn.linear_model import LogisticRegression

os.makedirs("examples/sample-ml-app/model", exist_ok=True)

# Train a simple sentiment/text-length binary classifier
X = np.array([[1], [2], [3], [4], [5], [10], [15], [20], [25], [30]])
y = np.array([0, 0, 0, 0, 0, 1, 1, 1, 1, 1])

clf = LogisticRegression()
clf.fit(X, y)

model_path = "examples/sample-ml-app/model/sentiment_model.pkl"
with open(model_path, "wb") as f:
    pickle.dump(clf, f)

print(f"Generated sample model at: {model_path}")

