import os
from typing import Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
from src.route_optimizer import FlightRouteOptimizer

app = FastAPI(title="FlightShield AI API", version="2.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "data", "turbulence_model.joblib")

# Load trained model (with fallback training if model file is missing)
def load_model():
    if not os.path.exists(MODEL_PATH):
        from src.train_model import train_and_save_model
        return train_and_save_model(model_path=MODEL_PATH)
    return joblib.load(MODEL_PATH)

model = load_model()
optimizer = FlightRouteOptimizer()

TURBULENCE_LABELS = {
    0: "Safe",
    1: "Moderate Turbulence",
    2: "Severe Turbulence"
}

FEATURE_COLUMNS = ["altitude", "wind_speed", "temperature", "pressure"]

class FlightData(BaseModel):
    altitude: float = 35000.0
    wind_speed: float = 0.0
    temperature: Optional[float] = -40.0
    pressure: Optional[float] = 1013.0
    source: Optional[str] = "Mumbai"
    destination: Optional[str] = "Dubai"

class RouteRequest(BaseModel):
    source: str = "Mumbai"
    destination: str = "Dubai"
    altitude: float = 35000.0
    wind_speed: float = 0.0
    temperature: float = -40.0
    pressure: float = 1013.0

@app.get("/")
def home():
    return {
        "message": "FlightShield AI backend engine is running",
        "version": "2.1.0",
        "model_loaded": model is not None,
        "features": ["ml_prediction", "atmospheric_risk_analysis", "route_optimization"]
    }

@app.post("/predict")
def predict(data: FlightData):
    alt = data.altitude
    wind = data.wind_speed
    temp = data.temperature if data.temperature is not None else -40.0
    press = data.pressure if data.pressure is not None else 1013.0

    # 1. Scikit-Learn Model Prediction
    features_df = pd.DataFrame(
        [[alt, wind, temp, press]],
        columns=FEATURE_COLUMNS
    )
    pred_class = int(model.predict(features_df)[0])
    ml_prediction = TURBULENCE_LABELS.get(pred_class, "Safe")

    confidence = 1.0
    if hasattr(model, "predict_proba"):
        probs = model.predict_proba(features_df)[0]
        confidence = round(float(max(probs)), 2)

    # 2. Atmospheric Clear Air Turbulence & Shear Risk Analysis
    risk_score = 15.0
    if wind > 100:
        risk_score += 45
    elif wind > 60:
        risk_score += 30
    elif wind > 30:
        risk_score += 15
    else:
        risk_score += 5

    if 28000 <= alt <= 41000:
        if wind > 70:
            risk_score += 25
        else:
            risk_score += 10
    elif alt > 41000:
        risk_score += 15

    if press < 990:
        risk_score += 25
    elif press < 1005:
        risk_score += 12

    expected_temp = max(-56.5, 15.0 - (alt / 1000.0) * 1.98)
    temp_diff = abs(temp - expected_temp)
    if temp_diff > 15:
        risk_score += 15
    elif temp_diff > 8:
        risk_score += 8

    risk_score = max(5.0, min(98.0, round(risk_score, 1)))

    if risk_score >= 70 or ml_prediction == "Severe Turbulence":
        prediction = "Severe Turbulence"
        cat_risk = "High"
        wind_shear = "Severe Jet Shear"
        advisory = "ALERT: High risk of severe turbulence & jet stream shear. Continuous seatbelt sign required. Request climb or reroute."
        rec_alt = "Climb to FL390 or descend to FL290 to exit shear layer"
    elif risk_score >= 40 or ml_prediction == "Moderate Turbulence":
        prediction = "Moderate Turbulence"
        cat_risk = "Moderate"
        wind_shear = "Moderate"
        advisory = "ADVISORY: Moderate chop expected along route. Pilot caution advised near jet stream boundary."
        rec_alt = "Adjust altitude by +2,000 ft if chop persists"
    else:
        prediction = "Safe"
        cat_risk = "Low"
        wind_shear = "Minimal"
        advisory = "OPTIMAL: Flight path conditions are stable with minimal atmospheric disturbance."
        rec_alt = "Maintain current flight level"

    # 3. Flight Route Optimization & Detour Calculation
    route_plan = optimizer.optimize_route(
        source=data.source or "Mumbai",
        destination=data.destination or "Dubai",
        turbulence_status=prediction,
        altitude=alt,
        wind_speed=wind
    )

    return {
        "prediction": prediction,
        "status": prediction,
        "confidence": confidence,
        "risk_score": risk_score,
        "cat_risk": cat_risk,
        "wind_shear_factor": wind_shear,
        "safety_advisory": advisory,
        "recommended_altitude": rec_alt,
        "source": data.source,
        "destination": data.destination,
        "route_plan": route_plan,
        "features": {
            "altitude": alt,
            "wind_speed": wind,
            "temperature": temp,
            "pressure": press
        }
    }

@app.post("/optimize-route")
def optimize_flight_route(data: RouteRequest):
    features_df = pd.DataFrame(
        [[data.altitude, data.wind_speed, data.temperature, data.pressure]],
        columns=FEATURE_COLUMNS
    )
    pred_class = int(model.predict(features_df)[0])
    turbulence_status = TURBULENCE_LABELS.get(pred_class, "Safe")

    route_plan = optimizer.optimize_route(
        source=data.source,
        destination=data.destination,
        turbulence_status=turbulence_status,
        altitude=data.altitude,
        wind_speed=data.wind_speed
    )
    return route_plan
