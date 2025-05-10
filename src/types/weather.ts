import type { LucideIcon } from 'lucide-react';
import { z } from 'zod';

export const LocationSchema = z.object({
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required (e.g., CA)"),
  country: z.string().min(1, "Country is required (e.g., US)"),
});

export type LocationData = z.infer<typeof LocationSchema>;

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  country: string;
  admin1?: string; // State or region
}

export interface GeocodingApiResponse {
  results?: GeocodingResult[];
  error?: boolean;
  reason?: string;
}

export interface NWSPointsProperties {
  forecast: string; // URL for the detailed forecast
  forecastHourly: string;
  forecastGridData: string;
  // Other properties like county, fireWeatherZone, etc.
}

export interface NWSPointsApiResponse {
  properties: NWSPointsProperties;
  // Other top-level properties
}

export interface NWSGridPointValue {
  uom: string; // e.g., "unit:percent"
  value: number | null;
 }
 
 export interface NWSGridPointProperties {
  relativeHumidity: {
    uom: string;
    values: { validTime: string; value: number }[];
  };
 }
 
 export interface NWSGridPointApiResponse {
  properties: NWSGridPointProperties;
 }

export interface NWSForecastPeriod {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: "F" | "C";
  temperatureTrend: string | null;
  probabilityOfPrecipitation: {
    unitCode: string;
    value: number | null;
  };
  dewpoint: {
    unitCode: string;
    value: number;
  };
  relativeHumidity: {
    unitCode: string;
    value: number;
  };
  windSpeed: string;
  windDirection: string;
  icon: string; // URL to an icon, we will use our own
  shortForecast: string;
  detailedForecast: string;
}

export interface NWSForecastProperties {
  updated: string;
  units: "us" | "si";
  forecastGenerator: string;
  generatedAt: string;
  updateTime: string;
  validTimes: string;
  elevation: {
    unitCode: string;
    value: number;
  };
  periods: NWSForecastPeriod[];
}

export interface NWSForecastApiResponse {
  properties: NWSForecastProperties;
}

export interface WeatherData {
  temperature: number;
  temperatureUnit: "F" | "C";
  description: string;
  humidity: number;
  icon: LucideIcon;
  windSpeed: string;
  windDirection: string;
  city: string;
  state?: string;
  country?: string;
}
