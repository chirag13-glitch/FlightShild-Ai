import folium

# coordinates for cities
cities = {
    "Mumbai": [19.0760, 72.8777],
    "Dubai": [25.2048, 55.2708],
    "Delhi": [28.6139, 77.2090],
    "London": [51.5074, -0.1278]
}

source = "Mumbai"
destination = "Dubai"

source_coords = cities[source]
dest_coords = cities[destination]

# create map
m = folium.Map(location=source_coords, zoom_start=4)

# source marker
folium.Marker(
    source_coords,
    popup=f"Source: {source}"
).add_to(m)

# destination marker
folium.Marker(
    dest_coords,
    popup=f"Destination: {destination}"
).add_to(m)

# draw route
folium.PolyLine(
    [source_coords, dest_coords],
    color="blue",
    weight=3
).add_to(m)

# save map
m.save("flight_route_map.html")

print("Flight route map created!")