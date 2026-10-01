import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

def train_and_save_model(data_path="data/turbulence_data.csv", model_path="data/turbulence_model.joblib"):
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Data file not found at {data_path}")

    # Load dataset
    df = pd.read_csv(data_path)
    X = df[["altitude", "wind_speed", "temperature", "pressure"]]
    y = df["turbulence"]

    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.15, random_state=42, stratify=y
    )

    # Train Random Forest Classifier
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)

    # Evaluate
    predictions = clf.predict(X_test)
    acc = accuracy_score(y_test, predictions)
    print(f"Model trained successfully. Test Accuracy: {acc * 100:.2f}%")
    print("\nClassification Report:\n", classification_report(y_test, predictions))

    # Save model artifact
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(clf, model_path)
    print(f"Model saved to: {model_path}")
    return clf

if __name__ == "__main__":
    train_and_save_model()
