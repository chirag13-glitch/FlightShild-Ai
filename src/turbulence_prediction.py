import pandas as pd
from sklearn.ensemble import RandomForestClassifier

# load dataset
data = pd.read_csv("data/turbulence_data.csv")

# features and target
X = data[["altitude", "wind_speed", "temperature", "pressure"]]
y = data["turbulence"]

# train model
model = RandomForestClassifier()
model.fit(X, y)

# take user input
altitude = int(input("Enter altitude: "))
wind_speed = int(input("Enter wind speed: "))
temperature = int(input("Enter temperature: "))
pressure = int(input("Enter pressure: "))

# prediction
prediction = model.predict([[altitude, wind_speed, temperature, pressure]])

# interpret result
if prediction[0] == 0:
    print("Turbulence Level: Safe")
elif prediction[0] == 1:
    print("Turbulence Level: Moderate")
else:
    print("Turbulence Level: Severe")