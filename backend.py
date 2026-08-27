from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="FlightShield AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FlightData(BaseModel):
    wind_speed: float = 0.0
    altitude: float = 35000.0
    temperature: Optional[float] = -40.0
    pressure: Optional[float] = 1013.0
    source: Optional[str] = ""
    destination: Optional[str] = ""

@app.get("/")
def home():
    return {"message": "FlightShield AI backend engine is running", "version": "2.0.0"}

@app.post("/predict")
def predict(data: FlightData):
    wind = data.wind_speed
    alt = data.altitude
    temp = data.temperature if data.temperature is not None else -40.0
    press = data.pressure if data.pressure is not None else 1013.0

    # Atmospheric Risk Algorithm
    risk_score = 15.0  # base baseline

    # Wind speed influence (Jetstream shear)
    if wind > 100:
        risk_score += 45
    elif wind > 60:
        risk_score += 30
    elif wind > 30:
        risk_score += 15
    else:
        risk_score += 5

    # Altitude & Jetstream Layer (Clear Air Turbulence risk is highest near jet core 30,000-40,000 ft)
    if 28000 <= alt <= 41000:
        if wind > 70:
            risk_score += 25
        else:
            risk_score += 10
    elif alt > 41000:
        risk_score += 15

    # Barometric pressure anomaly (low pressure system = convective turbulence)
    if press < 990:
        risk_score += 25
    elif press < 1005:
        risk_score += 12

    # Temperature instability (deviation from standard atmospheric lapse rate)
    # Standard temp at sea level ~15C, decreases ~2C per 1000ft up to tropopause (-56.5C)
    expected_temp = max(-56.5, 15.0 - (alt / 1000.0) * 1.98)
    temp_diff = abs(temp - expected_temp)
    if temp_diff > 15:
        risk_score += 15
    elif temp_diff > 8:
        risk_score += 8

    # Cap score between 5 and 98
    risk_score = max(5.0, min(98.0, round(risk_score, 1)))

    # Determine status & CAT risk level
    if risk_score >= 70:
        prediction = "Severe Turbulence"
        cat_risk = "High"
        wind_shear = "Severe Jet Shear"
        advisory = "ALERT: High risk of severe turbulence & jet stream shear. Continuous seatbelt sign required. Request climb or reroute."
        rec_alt = "Climb to FL390 or descend to FL290 to exit shear layer"
    elif risk_score >= 40:
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

    return {
        "prediction": prediction,
        "risk_score": risk_score,
        "cat_risk": cat_risk,
        "wind_shear_factor": wind_shear,
        "safety_advisory": advisory,
        "recommended_altitude": rec_alt
    }