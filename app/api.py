from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

app = FastAPI()

# load dataset
data = pd.read_csv("data/turbulence_data.csv")

X = data[["altitude", "wind_speed", "temperature", "pressure"]]
y = data["turbulence"]

model = RandomForestClassifier()
model.fit(X, y)


class FlightInput(BaseModel):
    altitude: int
    wind_speed: int
    temperature: int
    pressure: int
    source: str
    destination: str


@app.get("/")
def home():
    return {"message": "Aviation AI API running"}


@app.post("/predict")
def predict_flight(input: FlightInput):

    prediction = model.predict([[
        input.altitude,
        input.wind_speed,
        input.temperature,
        input.pressure
    ]])

    if prediction[0] == 0:
        result = "Safe"
    elif prediction[0] == 1:
        result = "Moderate Turbulence"
    else:
        result = "Severe Turbulence"

    return {
        "source": input.source,
        "destination": input.destination,
        "flight_status": result
    }