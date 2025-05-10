import type { LocationData, GeocodingApiResponse, GeocodingResult, NWSPointsApiResponse, NWSForecastApiResponse, NWSForecastPeriod, NWSForecastGridDataResponse } from '@/types/weather';

const USER_AGENT = "(WeatherWise/1.0, developer@example.com)"; // Required by NWS API

export async function fetchGeocoding(location: LocationData): Promise<GeocodingResult> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${location.city}&count=1&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Geocoding API request failed: ${response.statusText}`);
  }

  const data: GeocodingApiResponse = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error("No results found for the given location.");
  }
  
  // Normalize input for comparison
  const inputState = location.state.toLowerCase();
  const inputCountry = location.country.toLowerCase();
  
  // Find the best match
  const matchedLocation = data.results.find(loc =>
    loc.admin1?.toLowerCase() === inputState &&
    loc.country?.toLowerCase() === inputCountry
  );
  
  if (!matchedLocation) {
    throw new Error("No matching location found for given city, state, and country.");
  }
  
  if (data.error || !data.results || data.results.length === 0) {
    throw new Error(data.reason || "Location not found.");
  }
  
  return data.results[0];
}

export async function fetchNWSPoints(latitude: number, longitude: number): Promise<NWSPointsApiResponse> {
  const url = `https://api.weather.gov/points/${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  
  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`NWS Points API request failed: ${response.statusText} - ${errorData.detail || 'Unknown error'}`);
  }
  
  return response.json();
}

export async function fetchNWSForecast(forecastUrl: string): Promise<NWSForecastApiResponse> {
  const response = await fetch(forecastUrl, {
    headers: { 'User-Agent': USER_AGENT },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`NWS Forecast API request failed: ${response.statusText} - ${errorData.detail || 'Unknown error'}`);
  }
  
  return response.json();
}

export async function fetchNWSForecastGridData(gridDataUrl: string): Promise<NWSForecastGridDataResponse> {
  const response = await fetch(gridDataUrl, {
    headers: { 'User-Agent': USER_AGENT },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`NWS Forecast Grid Data API request failed: ${response.statusText} - ${errorData.detail || 'Unknown error'}`);
  }
  
  return response.json();
}
export function getCurrentWeatherFromForecast(forecast: NWSForecastApiResponse, location: LocationData): NWSForecastPeriod | null {
  if (!forecast.properties || !forecast.properties.periods || forecast.properties.periods.length === 0) {
    return null;
  }
  // The NWS API often returns the "current" or most immediate forecast as the first period.
  return forecast.properties.periods[0];
}
