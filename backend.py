from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FlightData(BaseModel):
    wind_speed: float
    altitude: float

@app.get("/")
def home():
    return {"message": "FlightShield AI backend is running"}

@app.post("/predict")
def predict(data: FlightData):

    turbulence = random.choice([
        "Safe",
        "Moderate Turbulence",
        "Severe Turbulence"
    ])

    return {
        "prediction": turbulence
    }