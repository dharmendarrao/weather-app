// src/components/weather-display.tsx
"use client";

import type { WeatherData, LocationData, HumidityForecastData } from '@/types/weather';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Droplets, Wind as WindIcon, MapPin } from 'lucide-react';
// Removed local icon imports like Sun, Cloud, etc. as they are now handled by icon-helper.tsx
// and the resulting component is passed via weather.icon.

interface WeatherDisplayProps {
  weather: WeatherData;
  location: LocationData;
}

export function WeatherDisplay({ weather, location }: WeatherDisplayProps) {
  // Use the icon component directly from the weather prop, which is determined by icon-helper.tsx
  const [humidityForecast, setHumidityForecast] = useState<HumidityForecastData | null>(null);

  useEffect(() => {
    const fetchHumidityForecast = async () => {
      // Assuming you have a way to fetch humidity forecast data based on location or weather data
      // This is a placeholder - replace with your actual data fetching logic
      const response = await fetch(`/api/weather/humidity?lat=${location.latitude}&lon=${location.longitude}`);
      const data = await response.json();
      setHumidityForecast(data);
    };
  }, [location]);
  const WeatherIcon = weather.icon;

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold text-primary flex items-center">
          <MapPin className="mr-2 h-6 w-6" /> Weather in {location.city}
        </CardTitle>
        <CardDescription>{weather.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center text-6xl font-bold text-foreground">
          <WeatherIcon data-ai-hint="weather condition" className="mr-4 h-16 w-16 text-yellow-500" /> {/* Using a distinct color for icon */}
          {Math.round(weather.temperature)}°{weather.temperatureUnit}
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2 p-3 bg-secondary/50 rounded-md">
            <Droplets className="h-5 w-5 text-primary" />
            <div>
              <p className="text-muted-foreground">Humidity</p>
              <p className="font-medium">
                {weather.humidity}%
                {humidityForecast && ` (Forecast: ${humidityForecast.value}%)`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-secondary/50 rounded-md">
            <WindIcon className="h-5 w-5 text-primary" />
            <div>
              <p className="text-muted-foreground">Wind</p>
              <p className="font-medium">{weather.windSpeed} {weather.windDirection}</p>
            </div>
          </div>
        </div>
        
      </CardContent>
    </Card>
  );
}

// Removed local getWeatherIconComponent and CloudSun definitions.
// They are now centralized in src/lib/icon-helper.tsx.
