import pandas as pd
import numpy as np

# number of samples
n = 1000

# generate random aviation data
altitude = np.random.randint(25000, 40000, n)
wind_speed = np.random.randint(50, 150, n)
temperature = np.random.randint(-60, -30, n)
pressure = np.random.randint(230, 280, n)

# turbulence logic
turbulence = []

for i in range(n):
    if wind_speed[i] > 120:
        turbulence.append(2)  # severe
    elif wind_speed[i] > 90:
        turbulence.append(1)  # moderate
    else:
        turbulence.append(0)  # safe

# create dataframe
data = pd.DataFrame({
    "altitude": altitude,
    "wind_speed": wind_speed,
    "temperature": temperature,
    "pressure": pressure,
    "turbulence": turbulence
})

# save dataset
data.to_csv("data/turbulence_data.csv", index=False)

print("Dataset created successfully!")
print(data.head())
