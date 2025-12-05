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
	const [retryCount, setRetryCount] = useState(0); // 🆕 Compteur de tentatives

	const refetch = useCallback(async () => {
		if (!enabled) return;

		// 🆕 Limite les retry à 2 tentatives
		if (retryCount >= 2) {
			console.warn("⚠️ Nombre maximum de tentatives atteint. Mode dégradé activé.");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const weatherData = await fetchWeather(location);
			setData(weatherData);
			setRetryCount(0); // 🆕 Reset le compteur si succès
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
			setError(new Error(errorMessage));
			setRetryCount((prev) => prev + 1); // 🆕 Incrémente le compteur

			console.error("❌ Erreur API météo:", errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, [location, enabled, retryCount]);

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
