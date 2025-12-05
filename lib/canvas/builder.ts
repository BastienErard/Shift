import type { Scene } from "./types";
import type { WorldConditions } from "./conditions";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./types";
import { getSkyColor, getGroundColor } from "./palette";
import {
	createHouse,
	createChimneySmoke,
	createTree,
	createSkyElements,
	createWeatherEffects,
} from "./elements";

/* Construit une scène complète selon les conditions actuelles */
export function buildScene(
	conditions: WorldConditions,
	cloudCover?: number,
	smokeOffset: number = 0,
	weatherOffset: number = 0
): Scene {
	const skyColor = getSkyColor(conditions);
	const groundColor = getGroundColor(conditions);

	// 🆕 Sépare les éclairs des autres effets météo
	const lightningElements =
		conditions.weather === "storm"
			? require("./elements/weather").createLightning(conditions, weatherOffset)
			: [];

	const elements = [
		// Ciel (base)
		...createSkyElements(conditions, cloudCover),

		// 🆕 Flash des éclairs (PAR-DESSUS le ciel, SOUS les nuages)
		// Note: Le flash est déjà dans createLightning, pas besoin de filtre spécial

		// Éléments au sol
		...createTree(conditions),
		...createHouse(conditions),
		...createChimneySmoke(conditions, smokeOffset),

		// Météo (pluie/neige + éclairs)
		...createWeatherEffects(conditions, weatherOffset),
	];

	return {
		dimensions: {
			width: CANVAS_WIDTH,
			height: CANVAS_HEIGHT,
		},
		skyColor,
		groundColor,
		elements,
	};
}

/* Construit une scène de test avec des conditions prédéfinies */
export function buildTestScene(preset: "sunny" | "night" | "rainy" | "snowy" = "sunny"): Scene {
	/* Conditions prédéfinies pour chaque preset */
	const testConditions: Record<string, WorldConditions> = {
		sunny: {
			timeOfDay: "noon",
			season: "summer",
			weather: "clear",
			weatherIntensity: "moderate",
			temperature: 25,
			daysSinceCreation: 10,
		},
		night: {
			timeOfDay: "night",
			season: "summer",
			weather: "clear",
			weatherIntensity: "moderate",
			temperature: 18,
			daysSinceCreation: 10,
		},
		rainy: {
			timeOfDay: "afternoon",
			season: "autumn",
			weather: "rain",
			weatherIntensity: "heavy",
			temperature: 12,
			daysSinceCreation: 45,
		},
		snowy: {
			timeOfDay: "morning",
			season: "winter",
			weather: "snow",
			weatherIntensity: "moderate",
			temperature: -2,
			daysSinceCreation: 120,
		},
	};

	const conditions = testConditions[preset];

	return buildScene(conditions);
}

/**
 * Construit une scène depuis la date/heure actuelles
 *
 * 🎓 Utilise les conditions réelles du système :
 * - Heure → timeOfDay
 * - Mois → season
 * - Date création → daysSinceCreation
 *
 * ⚠️ Météo par défaut = "clear" (sera remplacé par l'API plus tard)
 *
 * @param creationDate Date de création du monde (localStorage)
 * @returns Scene basée sur l'heure actuelle
 */
export function buildSceneFromCurrentTime(creationDate: Date = new Date()): Scene {
	const now = new Date();

	/* Détermine le moment de la journée */
	const hour = now.getHours();
	let timeOfDay: WorldConditions["timeOfDay"];

	if (hour >= 21 || hour < 5) timeOfDay = "night";
	else if (hour >= 5 && hour < 7) timeOfDay = "dawn";
	else if (hour >= 7 && hour < 12) timeOfDay = "morning";
	else if (hour >= 12 && hour < 14) timeOfDay = "noon";
	else if (hour >= 14 && hour < 18) timeOfDay = "afternoon";
	else timeOfDay = "dusk";

	/* Détermine la saison */
	const month = now.getMonth(); // 0-11
	let season: WorldConditions["season"];

	if (month >= 2 && month <= 4)
		season = "spring"; // Mars-Mai
	else if (month >= 5 && month <= 7)
		season = "summer"; // Juin-Août
	else if (month >= 8 && month <= 10)
		season = "autumn"; // Sept-Nov
	else season = "winter"; // Déc-Fév

	/* Calcule les jours depuis la création */
	const msPerDay = 1000 * 60 * 60 * 24;
	const daysSinceCreation = Math.max(
		0,
		Math.floor((now.getTime() - creationDate.getTime()) / msPerDay)
	);

	/* Conditions basées sur l'heure système */
	const conditions: WorldConditions = {
		timeOfDay,
		season,
		weather: "clear", // À remplacer par API
		weatherIntensity: "moderate",
		temperature: 20, // À remplacer par API
		daysSinceCreation,
	};

	return buildScene(conditions);
}
