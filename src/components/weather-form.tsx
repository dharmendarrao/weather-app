// src/components/weather-form.tsx
"use client";

import type { Control } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { LocationData } from "@/types/weather";
import { LocationSchema } from "@/types/weather";
import { Search, Eraser } from "lucide-react";
import { useEffect } from "react";

interface WeatherFormProps {
  onSubmit: (data: LocationData) => void;
  onClear: () => void;
  initialValues?: LocationData | null;
  isLoading?: boolean;
}

export function WeatherForm({
  onSubmit,
  onClear,
  initialValues,
  isLoading,
}: WeatherFormProps) {
  const form = useForm<LocationData>({
    resolver: zodResolver(LocationSchema),
    defaultValues: initialValues || { city: "", state: "", country: "" },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    } else {
      form.reset({ city: "", state: "", country: "" });
    }
  }, [initialValues, form]);

  const handleFormSubmit = (data: LocationData) => {
    onSubmit(data);
  };

  const handleClearClick = () => {
    form.reset({ city: "", state: "", country: "" });
    onClear();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control as unknown as Control<LocationData>}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Los Angeles"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control as unknown as Control<LocationData>}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., California"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control as unknown as Control<LocationData>}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., United States"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-4">
          <Button
            type="submit"
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={isLoading}
          >
            <Search className="mr-2 h-4 w-4" />
            {isLoading ? "Searching..." : "Search"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClearClick}
            className="flex-1"
            disabled={isLoading}
          >
            <Eraser className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </form>
    </Form>
  );
}
