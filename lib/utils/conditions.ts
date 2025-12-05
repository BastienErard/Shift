import type { WorldConditions, Season, TimeOfDay } from "@/lib/canvas/conditions";
import type { WeatherData } from "@/lib/api/weather";
import { weatherCodeToWeather, weatherCodeToIntensity } from "@/lib/api/weather";

/* Détermine la saison basée sur la date */
export function getSeason(date: Date): Season {
	const month = date.getMonth(); // 0-11

	// Hémisphère Nord
	if (month >= 2 && month <= 4) return "spring"; // Mars - Mai
	if (month >= 5 && month <= 7) return "summer"; // Juin - Août
	if (month >= 8 && month <= 10) return "autumn"; // Sept - Nov
	return "winter"; // Déc - Fév
}

/* Convertit les données API en WorldConditions */
export function weatherToConditions(
	weather: WeatherData,
	timeOfDay: TimeOfDay,
	daysSinceCreation: number = 0
): WorldConditions {
	const { weatherCodeToWeather, precipitationToIntensity } = require("@/lib/api/weather");

	const intensity =
		weather.precipitation > 0 ? precipitationToIntensity(weather.precipitation) : "moderate";

	return {
		timeOfDay,
		season: getSeason(weather.time),
		weather: weatherCodeToWeather(weather.weatherCode),
		weatherIntensity: intensity,
		temperature: weather.temperature,
		daysSinceCreation,
		cloudCover: weather.cloudCover,
		windSpeed: weather.windSpeed,
		windDirection: weather.windDirection,
	};
}
