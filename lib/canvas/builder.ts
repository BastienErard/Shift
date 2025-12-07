import type { Scene } from "./types";
import type { WorldConditions } from "./conditions";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./types";
import { getSkyColor, getGroundColor } from "./palette";
import {
	createHouse,
	createChimneySmoke,
	createTree,
	createForest,
	createBushes,
	createSkyElements,
	createShootingStar,
	createWeatherEffects,
	createGroundTexture,
	createRiver,
	createBridge,
} from "./elements";

/**
 * Construit une scène complète selon les conditions actuelles
 *
 * Ordre de rendu (du fond vers l'avant) :
 * 1. Ciel (couleur de fond)
 * 2. Éléments célestes (soleil/lune, étoiles, nuages)
 * 3. Sol (couleur de base)
 * 4. Forêt arrière-plan (3 plans de profondeur)
 * 5. Texture du sol
 * 6. Maison
 * 7. Arbre principal + buissons
 * 8. Rivière + pont
 * 9. Fumée de cheminée
 * 10. Effets météo (pluie, neige, éclairs)
 */
export function buildScene(
	conditions: WorldConditions,
	cloudCover?: number,
	smokeOffset: number = 0,
	weatherOffset: number = 0
): Scene {
	const skyColor = getSkyColor(conditions);
	const groundColor = getGroundColor(conditions);

	const elements = [
		// ====== CIEL ======
		// Éléments célestes (soleil/lune, étoiles, nuages) avec animation
		...createSkyElements(conditions, cloudCover, weatherOffset),

		// Étoiles filantes (la nuit uniquement)
		...createShootingStar(conditions, weatherOffset),

		// ====== SOL - ARRIÈRE-PLAN ======
		// Forêt en arrière-plan (plusieurs plans de profondeur)
		...createForest(conditions),

		// ====== SOL - TEXTURE ======
		// Texture du sol (herbe, rochers, neige)
		...createGroundTexture(conditions),

		// ====== ARBRES ARRIÈRE-PLAN (derrière la maison) ======
		// Arbre partiellement caché derrière la maison (à droite)
		...createTree(conditions, 520, 0.9),

		// ====== ÉLÉMENTS PRINCIPAUX ======
		// Maison cottage
		...createHouse(conditions),

		// Arbre principal (à gauche de la maison, devant)
		...createTree(conditions, 120, 1.0),

		// Buissons décoratifs
		...createBushes(conditions),

		// ====== RIVIÈRE ======
		// Rivière au premier plan (tout en bas)
		...createRiver(conditions, weatherOffset),

		// Petit pont
		...createBridge(conditions),

		// ====== ARBRE PREMIER PLAN ======
		// Un arbre au premier plan sur la berge SUD (tronc ancré sur la terre verte au sud de la rivière)
		// La berge sud commence à Y = CANVAS_HEIGHT - 90 + 50 = 560, on met le pied de l'arbre là
		...createTree(conditions, 680, 1.2, CANVAS_HEIGHT - 28),

		// ====== ANIMATIONS ======
		// Fumée de cheminée
		...createChimneySmoke(conditions, smokeOffset),

		// ====== MÉTÉO ======
		// Effets météo (pluie, neige, éclairs)
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

/**
 * Construit une scène de test avec des conditions prédéfinies
 */
export function buildTestScene(preset: "sunny" | "night" | "rainy" | "snowy" = "sunny"): Scene {
	const testConditions: Record<string, WorldConditions> = {
		sunny: {
			timeOfDay: "noon",
			season: "summer",
			weather: "clear",
			weatherIntensity: "moderate",
			temperature: 25,
			daysSinceCreation: 10,
			cloudCover: 0,
			windSpeed: 10,
			windDirection: 270,
		},
		night: {
			timeOfDay: "night",
			season: "summer",
			weather: "clear",
			weatherIntensity: "moderate",
			temperature: 18,
			daysSinceCreation: 10,
			cloudCover: 10,
			windSpeed: 5,
			windDirection: 90,
		},
		rainy: {
			timeOfDay: "afternoon",
			season: "autumn",
			weather: "rain",
			weatherIntensity: "heavy",
			temperature: 12,
			daysSinceCreation: 45,
			cloudCover: 85,
			windSpeed: 25,
			windDirection: 270,
		},
		snowy: {
			timeOfDay: "morning",
			season: "winter",
			weather: "snow",
			weatherIntensity: "moderate",
			temperature: -8,
			daysSinceCreation: 120,
			cloudCover: 70,
			windSpeed: 15,
			windDirection: 90,
		},
	};

	const conditions = testConditions[preset];

	return buildScene(conditions, conditions.cloudCover);
}

/**
 * Construit une scène depuis la date/heure actuelles
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
	const month = now.getMonth();
	let season: WorldConditions["season"];

	if (month >= 2 && month <= 4) season = "spring";
	else if (month >= 5 && month <= 7) season = "summer";
	else if (month >= 8 && month <= 10) season = "autumn";
	else season = "winter";

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
		weather: "clear",
		weatherIntensity: "moderate",
		temperature: 20,
		daysSinceCreation,
		cloudCover: 0,
		windSpeed: 10,
		windDirection: 270,
	};

	return buildScene(conditions);
}
