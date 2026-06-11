import { useState } from "react";
const predictFlight = async () => {

  const response = await fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      wind_speed: 120,
      altitude: 35000
    })
  });

  const data = await response.json();

  alert("Prediction: " + data.prediction);
};

const Index = () => {

  const [result, setResult] = useState("");

  const predictFlight = async () => {
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        wind_speed: 120,
        altitude: 35000
      })
    });

    const data = await response.json();
    setResult(data.prediction);
  };

  return (
    <div style={{textAlign:"center", marginTop:"120px"}}>

      <h1>FlightShield AI</h1>
      <h2>Predict Flight Safety</h2>

      <button onClick={predictFlight}>
Predict Flight Safety
</button>

      {result && (
        <h3 style={{marginTop:"30px"}}>
          Prediction: {result}
        </h3>
      )}

    </div>
  );
};

export default Index;