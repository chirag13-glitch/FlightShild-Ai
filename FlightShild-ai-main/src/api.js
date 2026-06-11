export async function predictFlight() {

const response = await fetch("http://127.0.0.1:8000/predict", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
wind_speed: 120,
altitude: 35000
})
})

const data = await response.json()

alert("Prediction: " + data.prediction)

}