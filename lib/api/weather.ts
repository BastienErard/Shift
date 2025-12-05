/* Documentation : https://open-meteo.com/en/docs */

import type { Weather, WeatherIntensity } from "@/lib/canvas/conditions";

/** Réponse brute de l'API Open-Meteo */
export interface OpenMeteoResponse {
	latitude: number;
	longitude: number;
	timezone: string;
	current_weather: {
		temperature: number;
		windspeed: number;
		winddirection: number;
		weathercode: number;
		is_day: number;
		time: string;
	};
	daily?: {
		sunrise: string[];
		sunset: string[];
	};
	current?: {
		precipitation?: number;
		cloudcover?: number;
	};
}

/** Données météo transformées pour Shift */
export interface WeatherData {
	temperature: number;
	weatherCode: number;
	windSpeed: number;
	isDay: boolean;
	time: Date;
	sunrise?: Date;
	sunset?: Date;
	cloudCover: number; // 0-100%
	precipitation: number; // mm
}

/** Coordonnées d'un lieu */
export interface Location {
	name: string;
	latitude: number;
	longitude: number;
}

/** Lieux prédéfinis */
export const LOCATIONS: Record<string, Location> = {
	lausanne: {
		name: "Lausanne, CH",
		latitude: 46.5197,
		longitude: 6.6323,
	},
	geneva: {
		name: "Genève, CH",
		latitude: 46.2044,
		longitude: 6.1432,
	},
	zurich: {
		name: "Zürich, CH",
		latitude: 47.3769,
		longitude: 8.5417,
	},
	paris: {
		name: "Paris, FR",
		latitude: 48.8566,
		longitude: 2.3522,
	},
	tokyo: {
		name: "Tokyo, JP",
		latitude: 35.6762,
		longitude: 139.6503,
	},
};

/* Lieu par défaut */
export const DEFAULT_LOCATION = LOCATIONS.lausanne;

/* Récupère les données météo depuis Open-Meteo */
export async function fetchWeather(location: Location): Promise<WeatherData> {
	const { latitude, longitude } = location;

	const url = new URL("https://api.open-meteo.com/v1/forecast");
	url.searchParams.set("latitude", latitude.toString());
	url.searchParams.set("longitude", longitude.toString());
	url.searchParams.set("current_weather", "true");
	url.searchParams.set("daily", "sunrise,sunset");
	url.searchParams.set("timezone", "auto");
	url.searchParams.set("current", "precipitation,cloudcover");
	url.searchParams.set("hourly", "precipitation");

	const response = await fetch(url.toString());

	if (!response.ok) {
		throw new Error(`Erreur API météo: ${response.status}`);
	}

	const data: OpenMeteoResponse = await response.json();

	// Transformer les données brutes en format Shift
	return {
		temperature: Math.round(data.current_weather.temperature),
		weatherCode: data.current_weather.weathercode,
		windSpeed: data.current_weather.windspeed,
		isDay: data.current_weather.is_day === 1,
		time: new Date(data.current_weather.time),
		sunrise: data.daily?.sunrise?.[0] ? new Date(data.daily.sunrise[0]) : undefined,
		sunset: data.daily?.sunset?.[0] ? new Date(data.daily.sunset[0]) : undefined,
		cloudCover: data.current?.cloudcover ?? 50,
		precipitation: data.current?.precipitation ?? 0,
	};
}

/* Convertit un code météo WMO en type Weather pour Shift */
export function weatherCodeToWeather(code: number): Weather {
	// 0: Ciel dégagé
	if (code === 0) return "clear";

	// 1-3: Peu nuageux à couvert
	if (code >= 1 && code <= 3) return "cloudy";

	// 45, 48: Brouillard
	if (code === 45 || code === 48) return "cloudy";

	// 51-57: Bruine
	if (code >= 51 && code <= 57) return "rain";

	// 61-67: Pluie
	if (code >= 61 && code <= 67) return "rain";

	// 71-77: Neige
	if (code >= 71 && code <= 77) return "snow";

	// 80-82: Averses
	if (code >= 80 && code <= 82) return "rain";

	// 85-86: Averses de neige
	if (code >= 85 && code <= 86) return "snow";

	// 95, 96, 99: Orage
	if (code === 95 || code === 96 || code === 99) return "storm";

	// Par défaut
	return "clear";
}

/* Détermine l'intensité météo basée sur le code WMO */
export function weatherCodeToIntensity(code: number): WeatherIntensity {
	// Codes avec intensité légère
	const lightCodes = [1, 51, 56, 61, 66, 71, 80, 85];
	if (lightCodes.includes(code)) return "light";

	// Codes avec intensité forte
	const heavyCodes = [3, 55, 57, 65, 67, 75, 77, 82, 86, 96, 99];
	if (heavyCodes.includes(code)) return "heavy";

	// Par défaut : modérée
	return "moderate";
}

/* Crée une Location à partir de coordonnées GPS */
export function createLocationFromCoords(
	latitude: number,
	longitude: number,
	name: string = "Ma position"
): Location {
	return {
		name,
		latitude,
		longitude,
	};
}

/* Détermine l'intensité météo basée sur les précipitations */
export function precipitationToIntensity(precipitation: number): "light" | "moderate" | "heavy" {
	if (precipitation < 2) return "light";
	if (precipitation < 10) return "moderate";
	return "heavy";
}
