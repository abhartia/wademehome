"use client";

import { useQuery } from "@tanstack/react-query";

export type WeatherDaily = {
  dates: string[];
  maxC: number[];
  minC: number[];
};

export type AirNow = {
  usAqi: number | null;
  pm10: number | null;
};

async function fetchForecast(latitude: number, longitude: number): Promise<WeatherDaily> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min");
  url.searchParams.set("forecast_days", "7");
  url.searchParams.set("temperature_unit", "celsius");
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Weather request failed");
  const data = (await res.json()) as {
    daily?: { time?: string[]; temperature_2m_max?: number[]; temperature_2m_min?: number[] };
  };
  const d = data.daily;
  return {
    dates: d?.time ?? [],
    maxC: d?.temperature_2m_max ?? [],
    minC: d?.temperature_2m_min ?? [],
  };
}

async function fetchAir(latitude: number, longitude: number): Promise<AirNow> {
  const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("current", "us_aqi,pm10");
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Air quality request failed");
  const data = (await res.json()) as {
    current?: { us_aqi?: number; pm10?: number };
  };
  const c = data.current;
  return {
    usAqi: typeof c?.us_aqi === "number" ? c.us_aqi : null,
    pm10: typeof c?.pm10 === "number" ? c.pm10 : null,
  };
}

export function useOpenMeteoPropertyInsights(
  latitude: number | undefined,
  longitude: number | undefined,
  options?: { enabled?: boolean },
) {
  const has =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);
  const enabled = (options?.enabled ?? true) && has;

  const weather = useQuery({
    queryKey: ["open-meteo-forecast", latitude, longitude],
    queryFn: () => fetchForecast(latitude as number, longitude as number),
    enabled,
    staleTime: 60 * 60_000,
  });

  const air = useQuery({
    queryKey: ["open-meteo-air", latitude, longitude],
    queryFn: () => fetchAir(latitude as number, longitude as number),
    enabled,
    staleTime: 30 * 60_000,
  });

  return { weather, air };
}
