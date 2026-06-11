// Simple geocoding service using OpenStreetMap's Nominatim API
// This is free to use but has a rate limit of 1 request per second.

export interface Coordinates {
  lat: number;
  lng: number;
}

export const getCoordinates = async (cityName: string): Promise<Coordinates | null> => {
  if (!cityName || cityName.trim() === "") return null;

  try {
    const encodedCity = encodeURIComponent(cityName.trim());
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?city=${encodedCity}&format=json&limit=1`
    );

    if (!response.ok) {
      throw new Error("Geocoding failed");
    }

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }

    return null; // City not found
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};
