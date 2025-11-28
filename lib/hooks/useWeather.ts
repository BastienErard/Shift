"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchWeather, DEFAULT_LOCATION, type WeatherData, type Location } from "@/lib/api/weather";

interface UseWeatherOptions {
	location?: Location;
	refreshInterval?: number;
	enabled?: boolean;
}

interface UseWeatherReturn {
	data: WeatherData | null;
	isLoading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
}

/* Hook pour récupérer les données météo en temps réel */
export function useWeather({
	location = DEFAULT_LOCATION,
	refreshInterval = 5 * 60 * 1000, // 5 minutes
	enabled = true,
}: UseWeatherOptions = {}): UseWeatherReturn {
	const [data, setData] = useState<WeatherData | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const refetch = useCallback(async () => {
		if (!enabled) return;

		setIsLoading(true);
		setError(null);

		try {
			const weatherData = await fetchWeather(location);
			setData(weatherData);
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Erreur inconnue"));
		} finally {
			setIsLoading(false);
		}
	}, [location, enabled]);

	// Fetch initial
	useEffect(() => {
		if (enabled) {
			refetch();
		}
	}, [refetch, enabled]);

	// Rafraîchissement automatique
	useEffect(() => {
		if (!enabled || refreshInterval <= 0) return;

		const interval = setInterval(refetch, refreshInterval);
		return () => clearInterval(interval);
	}, [refetch, refreshInterval, enabled]);

	return { data, isLoading, error, refetch };
}
