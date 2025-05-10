// src/lib/icon-helper.tsx
import * as React from 'react'; // Added for forwardRef
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind as WindIcon, CloudFog, CloudDrizzle, Snowflake, Umbrella } from 'lucide-react';
import type { LucideIcon, LucideProps } from 'lucide-react';

// Custom CloudSun icon component, behaving like a Lucide icon.
const CloudSunComponent = React.forwardRef<SVGSVGElement, LucideProps>(
  ({ size = 24, color = "currentColor", strokeWidth = 2, absoluteStrokeWidth, className, children, ...props }, ref) => (
  <svg
    ref={ref}
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 2v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="M20 12h2" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M12 20v2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="M4 12H2" />
    <path d="m6.34 6.34-1.41-1.41" />
    <path d="M16 16.1A4.5 4.5 0 0 0 17.5 8H16V6.2A4.3 4.3 0 0 0 12 2a4.5 4.5 0 0 0-4.27 6.03A6 6 0 0 0 6 17h10Z" />
  </svg>
));
CloudSunComponent.displayName = 'CloudSun';

// Cast to LucideIcon to satisfy the return type of getWeatherIconComponent
const CloudSun: LucideIcon = CloudSunComponent;

export function getWeatherIconComponent(shortForecast: string): LucideIcon {
  const forecast = shortForecast.toLowerCase();
  if (forecast.includes("sunny") || forecast.includes("clear")) return Sun;
  if (forecast.includes("partly cloudy") || forecast.includes("mostly cloudy") || forecast.includes("partly sunny")) return CloudSun;
  if (forecast.includes("cloudy") || forecast.includes("overcast")) return Cloud;
  
  if (forecast.includes("drizzle") || forecast.includes("light rain")) return CloudDrizzle;
  if (forecast.includes("rain showers") || forecast.includes("showers") || forecast.includes("rain")) return CloudRain;
  
  if (forecast.includes("thunderstorm")) return CloudLightning;
  
  if (forecast.includes("snow") || forecast.includes("flurries")) return Snowflake; // Or CloudSnow
  
  if (forecast.includes("fog") || forecast.includes("mist") || forecast.includes("haze")) return CloudFog;
  
  if (forecast.includes("windy") || forecast.includes("breezy")) return WindIcon;

  // Broader categories for less specific terms
  if (forecast.includes("chance") || forecast.includes("slight chance") || forecast.includes("patchy")) {
     if (forecast.includes("rain") || forecast.includes("showers")) return Umbrella; 
     if (forecast.includes("snow")) return Snowflake;
     if (forecast.includes("thunderstorm")) return CloudLightning;
  }

  // Default icon if no specific match
  return Cloud; 
}
