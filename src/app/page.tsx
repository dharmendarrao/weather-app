// src/app/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { WeatherForm } from "@/components/weather-form";
import { WeatherDisplay } from "@/components/weather-display";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useLocalStorage from "@/hooks/use-local-storage";
import {
  fetchGeocoding,
  fetchNWSPoints,
  fetchNWSForecast,
  getCurrentWeatherFromForecast,
  fetchNWSForecastGridData,
} from "@/lib/weather-api";
import type {
  LocationData,
  WeatherData,
  NWSForecastPeriod,
  GeocodingResult,
} from "@/types/weather";
import { getWeatherIconComponent } from "@/lib/icon-helper"; // Path remains the same, Next.js resolves .tsx
import { useToast } from "@/hooks/use-toast";
import { Globe } from "lucide-react";

export default function HomePage() {
  const [lastLocation, setLastLocation, clearLastLocation] =
    useLocalStorage<LocationData | null>("weatherwise-last-location", null);
  const [currentLocationForDisplay, setCurrentLocationForDisplay] =
    useState<LocationData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const processAndSetWeatherData = (
    forecastPeriod: NWSForecastPeriod,
    geoResult: GeocodingResult,
    submittedLocation: LocationData
  ) => {
    const newWeatherData: WeatherData = {
      temperature: forecastPeriod.temperature,
      temperatureUnit: forecastPeriod.temperatureUnit,
      description: forecastPeriod.shortForecast,
      humidity: forecastPeriod.relativeHumidity?.value ?? null,
      icon: getWeatherIconComponent(forecastPeriod.shortForecast),
      windSpeed: forecastPeriod.windSpeed,
      windDirection: forecastPeriod.windDirection,
      city: geoResult.name, // Use geocoded city name for accuracy
      state: geoResult.admin1,
      country: geoResult.country_code,
    };
    setWeatherData(newWeatherData);
    setCurrentLocationForDisplay(submittedLocation); // Keep the user's input for display context
    setLastLocation(submittedLocation); // Save user's original input
    setError(null);
  };

  const fetchWeatherForLocation = useCallback(
    async (location: LocationData) => {
      setIsLoading(true);
      setError(null);
      setWeatherData(null); // Clear previous weather data

      try {
        const geoResult = await fetchGeocoding(location);
        if (!geoResult) {
          throw new Error("Location not found.");
        }

        const pointsData = await fetchNWSPoints(
          geoResult.latitude,
          geoResult.longitude
        );
        const forecastData = await fetchNWSForecast(
          pointsData.properties.forecast
        );
        const forcastDataForHumedity = await fetchNWSForecastGridData(
          pointsData.properties.forecastGridData
        );
        const currentPeriod = getCurrentWeatherFromForecast(
          forecastData,
          location
        );
        if (currentPeriod) {
          // Extract the first available humidity value (you could refine this later by time match)
          const humidityValue =
            forcastDataForHumedity?.properties?.relativeHumidity?.values?.[0]
              ?.value ?? null;

          // Attach the humidity to the currentPeriod or pass separately
          const enrichedCurrentPeriod = {
            ...currentPeriod,
            relativeHumidity: { unitCode: "", value: humidityValue },
          };

          processAndSetWeatherData(enrichedCurrentPeriod, geoResult, location);
          toast({
            title: "Weather Updated",
            description: `Showing weather for ${geoResult.name}.`,
          });
        } else {
          throw new Error("Could not retrieve current weather conditions.");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred.";
        setError(errorMessage);
        setWeatherData(null);
        setCurrentLocationForDisplay(null);
        toast({
          variant: "destructive",
          title: "Error Fetching Weather",
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [setLastLocation, toast]
  );

  useEffect(() => {
    if (
      lastLocation &&
      lastLocation.city &&
      lastLocation.state &&
      lastLocation.country
    ) {
      if (!weatherData) {
        fetchWeatherForLocation(lastLocation);
      } else if (
        currentLocationForDisplay &&
        (currentLocationForDisplay.city !== lastLocation.city ||
          currentLocationForDisplay.state !== lastLocation.state ||
          currentLocationForDisplay.country !== lastLocation.country)
      ) {
        fetchWeatherForLocation(lastLocation);
      } else if (!currentLocationForDisplay && weatherData) {
        setCurrentLocationForDisplay(lastLocation);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastLocation, fetchWeatherForLocation]);

  const handleFormSubmit = (data: LocationData) => {
    fetchWeatherForLocation(data);
  };

  const handleClear = () => {
    clearLastLocation();
    setWeatherData(null);
    setCurrentLocationForDisplay(null);
    setError(null);
    setIsLoading(false);
    toast({
      title: "Form Cleared",
      description: "Last searched location has been cleared.",
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-secondary">
      <div className="w-full max-w-lg space-y-8">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Globe className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-4xl font-bold text-primary">
              WeatherWise
            </CardTitle>
            <CardDescription className="text-lg">
              Your simple weather companion.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WeatherForm
              onSubmit={handleFormSubmit}
              onClear={handleClear}
              initialValues={lastLocation}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        {isLoading && (
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <LoadingSpinner text="Fetching weather data..." />
            </CardContent>
          </Card>
        )}

        {error && !isLoading && (
          <Alert variant="destructive" className="shadow-lg">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {weatherData && currentLocationForDisplay && !isLoading && !error && (
          <WeatherDisplay
            weather={weatherData}
            location={currentLocationForDisplay}
          />
        )}
      </div>
    </main>
  );
}
