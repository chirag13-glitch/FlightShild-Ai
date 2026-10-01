import math
from typing import Dict, List, Optional, Tuple, Any

# Standard airport / city coordinates [latitude, longitude]
CITY_COORDINATES: Dict[str, List[float]] = {
    "mumbai": [19.0760, 72.8777],
    "delhi": [28.6139, 77.2090],
    "bengaluru": [12.9716, 77.5946],
    "bangalore": [12.9716, 77.5946],
    "hyderabad": [17.3850, 78.4867],
    "chennai": [13.0827, 80.2707],
    "kolkata": [22.5726, 88.3639],
    "dubai": [25.2048, 55.2708],
    "london": [51.5074, -0.1278],
    "new york": [40.7128, -74.0060],
    "san francisco": [37.7749, -122.4194],
    "paris": [48.8566, 2.3522],
    "frankfurt": [50.1109, 8.6821],
    "tokyo": [35.6762, 139.6503],
    "singapore": [1.3521, 103.8198],
    "sydney": [-33.8688, 151.2093],
    "doha": [25.2854, 51.5310],
    "toronto": [43.6532, -79.3832],
    "los angeles": [34.0522, -118.2437],
    "chicago": [41.8781, -87.6298],
    "amsterdam": [52.3676, 4.9041],
    "bangkok": [13.7563, 100.5018],
    "hong kong": [22.3193, 114.1694],
    "istanbul": [41.0082, 28.9784]
}

EARTH_RADIUS_KM = 6371.0

def haversine_distance(coord1: List[float], coord2: List[float]) -> float:
    """Calculate the great-circle distance between two points in km."""
    lat1, lon1 = math.radians(coord1[0]), math.radians(coord1[1])
    lat2, lon2 = math.radians(coord2[0]), math.radians(coord2[1])

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return EARTH_RADIUS_KM * c

def calculate_path_length(waypoints: List[List[float]]) -> float:
    """Calculate cumulative distance along a list of waypoints in km."""
    total = 0.0
    for i in range(len(waypoints) - 1):
        total += haversine_distance(waypoints[i], waypoints[i + 1])
    return total

class FlightRouteOptimizer:
    def __init__(self, custom_cities: Optional[Dict[str, List[float]]] = None):
        self.cities = {k.lower(): v for k, v in CITY_COORDINATES.items()}
        if custom_cities:
            for k, v in custom_cities.items():
                self.cities[k.lower()] = v

    def resolve_city_coords(self, city_name: str, fallback_lat: float = 20.0, fallback_lon: float = 78.0) -> List[float]:
        """Lookup city coordinates or provide approximate fallback."""
        cleaned = (city_name or "").strip().lower()
        if cleaned in self.cities:
            return self.cities[cleaned]
        # Partial match
        for name, coords in self.cities.items():
            if name in cleaned or cleaned in name:
                return coords
        return [fallback_lat, fallback_lon]

    def interpolate_route(self, start: List[float], end: List[float], num_points: int = 15) -> List[List[float]]:
        """Generate smooth waypoints along the direct route."""
        points = []
        for i in range(num_points):
            t = i / (num_points - 1)
            lat = start[0] + t * (end[0] - start[0])
            lon = start[1] + t * (end[1] - start[1])
            points.append([round(lat, 4), round(lon, 4)])
        return points

    def optimize_route(
        self,
        source: str,
        destination: str,
        turbulence_status: str,
        altitude: float = 35000.0,
        wind_speed: float = 0.0
    ) -> Dict[str, Any]:
        """
        Calculates direct route and safe detour route if turbulence is detected.
        """
        src_coords = self.resolve_city_coords(source, 28.6139, 77.2090) # Default Delhi
        dst_coords = self.resolve_city_coords(destination, 25.2048, 55.2708) # Default Dubai

        # Generate direct route waypoints
        direct_waypoints = self.interpolate_route(src_coords, dst_coords, num_points=15)
        direct_distance_km = round(calculate_path_length(direct_waypoints), 1)

        is_severe = turbulence_status == "Severe Turbulence"
        is_moderate = turbulence_status == "Moderate Turbulence"
        requires_reroute = is_severe or is_moderate

        # Midpoint calculation
        mid_lat = (src_coords[0] + dst_coords[0]) / 2.0
        mid_lon = (src_coords[1] + dst_coords[1]) / 2.0

        # Normal vector to route for lateral deviation
        dlat = dst_coords[0] - src_coords[0]
        dlon = dst_coords[1] - src_coords[1]
        norm = math.hypot(dlat, dlon) or 1.0

        # Perpendicular unit vector
        perp_lat = -dlon / norm
        perp_lon = dlat / norm

        # Determine detour magnitude
        if is_severe:
            deviation_deg = 3.5  # ~380km offset
            recommended_alt = altitude + 4000.0 if altitude <= 36000 else altitude - 4000.0
            alt_advice = f"Climb to {int(recommended_alt)} ft (FL{int(recommended_alt/100)}) to bypass upper jet-stream turbulence" if recommended_alt > altitude else f"Descend to {int(recommended_alt)} ft (FL{int(recommended_alt/100)}) below storm shear layer"
            direct_safety_score = 30
            optimized_safety_score = 96
        elif is_moderate:
            deviation_deg = 1.8  # ~200km offset
            recommended_alt = altitude + 2000.0 if altitude <= 38000 else altitude - 2000.0
            alt_advice = f"Adjust altitude to {int(recommended_alt)} ft for smoother airflow"
            direct_safety_score = 65
            optimized_safety_score = 92
        else:
            deviation_deg = 0.0
            recommended_alt = altitude
            alt_advice = "Maintain current cruising altitude. Atmospheric corridor is clear."
            direct_safety_score = 98
            optimized_safety_score = 98

        # Generate optimized route waypoints
        optimized_waypoints = []
        num_pts = 15
        for i in range(num_pts):
            t = i / (num_pts - 1)
            # Smooth bell curve for lateral detour: sin(pi * t)
            detour_weight = math.sin(math.pi * t) * deviation_deg
            lat = src_coords[0] + t * (dst_coords[0] - src_coords[0]) + perp_lat * detour_weight
            lon = src_coords[1] + t * (dst_coords[1] - src_coords[1]) + perp_lon * detour_weight
            optimized_waypoints.append([round(lat, 4), round(lon, 4)])

        optimized_distance_km = round(calculate_path_length(optimized_waypoints), 1)
        extra_distance_km = round(max(0.0, optimized_distance_km - direct_distance_km), 1)

        # Average cruise speed ~850 km/h
        direct_time_hours = direct_distance_km / 850.0
        optimized_time_hours = optimized_distance_km / 850.0
        extra_time_mins = round((optimized_time_hours - direct_time_hours) * 60)

        # Hazard epicenter (simulated at midpoint where turbulence was detected)
        hazard_center = [round(mid_lat, 4), round(mid_lon, 4)]
        hazard_radius_km = 300 if is_severe else (180 if is_moderate else 0)

        return {
            "source": source or "Origin",
            "destination": destination or "Destination",
            "source_coords": src_coords,
            "destination_coords": dst_coords,
            "turbulence_status": turbulence_status,
            "has_reroute": requires_reroute,
            "hazard_zone": {
                "center": hazard_center,
                "radius_km": hazard_radius_km,
                "severity": turbulence_status
            } if requires_reroute else None,
            "direct_route": direct_waypoints,
            "optimized_route": optimized_waypoints,
            "metrics": {
                "direct_distance_km": direct_distance_km,
                "optimized_distance_km": optimized_distance_km,
                "extra_distance_km": extra_distance_km,
                "direct_flight_time_mins": round(direct_time_hours * 60),
                "optimized_flight_time_mins": round(optimized_time_hours * 60),
                "extra_time_mins": max(0, extra_time_mins),
                "original_altitude": altitude,
                "recommended_altitude": recommended_alt,
                "altitude_advice": alt_advice,
                "direct_safety_score": direct_safety_score,
                "optimized_safety_score": optimized_safety_score
            }
        }
