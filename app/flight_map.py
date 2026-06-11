import os
import folium
import pandas as pd

# resolve dataset path relative to this script so it works from any cwd
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
csv_path = os.path.join(base_dir, "data", "turbulence_data.csv")

if not os.path.exists(csv_path):
    raise FileNotFoundError(f"Turbulence data file not found: {csv_path}")

# load dataset
data = pd.read_csv(csv_path)

if data.empty:
    raise ValueError(f"Turbulence data is empty: {csv_path}")

if "turbulence" not in data.columns:
    raise KeyError(f"Missing required column 'turbulence' in CSV: {csv_path}")

# create base map (center around India for example)
flight_map = folium.Map(location=[20.5, 78.9], zoom_start=4)

# add turbulence points
for _, row in data.iterrows():

    # choose color based on turbulence level
    if row["turbulence"] == 0:
        color = "green"
    elif row["turbulence"] == 1:
        color = "orange"
    else:
        color = "red"

    # fake coordinates for visualization
    lat = 20 + (_ % 10)
    lon = 75 + (_ % 10)

    folium.CircleMarker(
        location=[lat, lon],
        radius=5,
        color=color,
        fill=True,
        fill_color=color
    ).add_to(flight_map)

# save map
flight_map.save("flight_turbulence_map.html")

print("Map created successfully!")