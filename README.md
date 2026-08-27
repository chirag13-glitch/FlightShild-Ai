# ✈️ FlightShield AI

FlightShield AI is an intelligent flight safety prediction platform designed to analyze flight conditions and provide turbulence risk assessments. The system combines a modern React frontend with a FastAPI backend to deliver real-time flight safety insights.

## 🚀 Features

* AI-powered turbulence prediction
* Flight parameter analysis
* Interactive route visualization
* Modern aviation dashboard
* FastAPI backend API
* Responsive React frontend
* Real-time prediction results

## 🛠️ Tech Stack

### Frontend

* React.js
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* Three.js

### Backend

* FastAPI
* Python
* Pydantic
* CORS Middleware

## 📂 Project Structure

```text
FlightShield-AI/
│
├── src/                  # Frontend source code
├── public/               # Static assets
├── backend.py            # FastAPI backend
├── package.json
└── README.md
```

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/your-username/FlightShield-AI.git
cd FlightShield-AI
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Start Frontend

```bash
npm run dev
```

### 4. Install Backend Dependencies

```bash
pip install fastapi uvicorn pydantic
```

### 5. Start Backend

```bash
uvicorn backend:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

Frontend runs on:

```text
http://localhost:5173
```

## API Endpoint

### Predict Turbulence

```http
POST /predict
```

Request:

```json
{
  "source": "New York",
  "destination": "London",
  "altitude": 35000,
  "wind_speed": 120,
  "temperature": -40,
  "pressure": 1013
}
```

Response:

```json
{
  "prediction": "Severe Turbulence",
  "risk_score": 93.0,
  "cat_risk": "High",
  "wind_shear_factor": "Severe Jet Shear",
  "safety_advisory": "ALERT: High risk of severe turbulence & jet stream shear. Continuous seatbelt sign required. Request climb or reroute.",
  "recommended_altitude": "Climb to FL390 or descend to FL290 to exit shear layer"
}
```

## Future Improvements

* Real weather API integration
* Machine Learning prediction model
* Live flight tracking
* Airport risk analysis
* Historical turbulence analytics
* AWS deployment

## 👨‍💻 Team

Developed as an AI-powered aviation safety project focused on flight risk assessment and turbulence prediction.

## License

This project is licensed under the MIT License.
