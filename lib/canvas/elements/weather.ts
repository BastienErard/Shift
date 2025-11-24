import type { Element } from "../types";
import type { WorldConditions } from "../conditions";
import { rectangle } from "../types";
import { getPrecipitationColor } from "../palette";
import { CANVAS_WIDTH, CANVAS_HEIGHT, HORIZON_Y } from "../types";
import { hasPrecipitation } from "../conditions";

/* Crée les gouttes de pluie */
export function createRain(conditions: WorldConditions): Element[] {
	const { weather, weatherIntensity } = conditions;

	// Pluie uniquement si weather = rain ou storm
	if (weather !== "rain" && weather !== "storm") {
		return [];
	}

	const elements: Element[] = [];
	const color = getPrecipitationColor(conditions);

	/* Nombre de gouttes selon l'intensité */
	const dropCounts = {
		light: 25,
		moderate: 50,
		heavy: 80,
	};

	const dropCount = dropCounts[weatherIntensity];

	/* Dimensions des gouttes selon l'intensité */
	const dropDimensions = {
		light: { width: 1, height: 10 },
		moderate: { width: 2, height: 15 },
		heavy: { width: 2, height: 20 },
	};

	const { width: dropWidth, height: dropHeight } = dropDimensions[weatherIntensity];

	/* Génère les positions des gouttes */
	for (let i = 0; i < dropCount; i++) {
		// Position X : répartition régulière avec légère variation
		const baseX = (i * CANVAS_WIDTH) / dropCount;
		const offsetX = ((i * 17) % 20) - 10; // Variation -10 à +10 pixels
		const x = baseX + offsetX;

		// Position Y : variation basée sur l'index pour effet de profondeur
		const y = (i * 31) % (HORIZON_Y + 50);

		elements.push(rectangle(x, y, dropWidth, dropHeight, color));
	}

	return elements;
}

/* Crée les flocons de neige */
export function createSnow(conditions: WorldConditions): Element[] {
	const { weather, weatherIntensity } = conditions;

	// Neige uniquement si weather = snow
	if (weather !== "snow") {
		return [];
	}

	const elements: Element[] = [];
	const color = getPrecipitationColor(conditions);

	/* Nombre de flocons selon l'intensité */
	const flakeCounts = {
		light: 20,
		moderate: 40,
		heavy: 70,
	};

	const flakeCount = flakeCounts[weatherIntensity];

	/* Génère les flocons */
	for (let i = 0; i < flakeCount; i++) {
		// Position X : répartition avec variation
		const baseX = (i * CANVAS_WIDTH) / flakeCount;
		const offsetX = ((i * 23) % 30) - 15;
		const x = baseX + offsetX;

		// Position Y : variation
		const y = (i * 37) % (HORIZON_Y + 80);

		// Taille : varie entre 2 et 5 pixels selon l'index
		const size = 2 + ((i * 13) % 4);

		elements.push(rectangle(x, y, size, size, color));
	}

	return elements;
}

/* Crée un éclair */
export function createLightning(conditions: WorldConditions): Element[] {
	const { weather, weatherIntensity } = conditions;

	// Éclair uniquement si orage violent
	if (weather !== "storm" || weatherIntensity !== "heavy") {
		return [];
	}

	const elements: Element[] = [];

	/* Couleur de l'éclair : jaune/blanc brillant */
	const lightningColor = { r: 255, g: 255, b: 200 };

	/* Position de base de l'éclair */
	const startX = CANVAS_WIDTH * 0.6;
	const startY = 30;

	/* Forme de l'éclair en zigzag */
	const segments = [
		{ x: 0, y: 0, width: 8, height: 25 },
		{ x: -15, y: 25, width: 20, height: 8 },
		{ x: -15, y: 33, width: 8, height: 30 },
		{ x: -30, y: 63, width: 20, height: 8 },
		{ x: -30, y: 71, width: 6, height: 35 },
		{ x: -40, y: 106, width: 15, height: 6 },
		{ x: -40, y: 112, width: 5, height: 25 },
	];

	for (const segment of segments) {
		elements.push(
			rectangle(
				startX + segment.x,
				startY + segment.y,
				segment.width,
				segment.height,
				lightningColor
			)
		);
	}

	/* Lueur autour de l'éclair */
	const glowColor = { r: 200, g: 200, b: 255 };

	// Lueur derrière le segment principal
	elements.unshift(rectangle(startX - 5, startY - 5, 18, 35, glowColor));

	return elements;
}

/* Crée tous les effets météorologiques */
export function createWeatherEffects(conditions: WorldConditions): Element[] {
	// Pas de précipitations = pas d'effets
	if (!hasPrecipitation(conditions)) {
		return [];
	}

	const elements: Element[] = [];

	// Ajoute les précipitations appropriées
	elements.push(...createRain(conditions));
	elements.push(...createSnow(conditions));

	// Ajoute l'éclair si orage violent
	elements.push(...createLightning(conditions));

	return elements;
}

/* Crée du brouillard */
export function createFog(conditions: WorldConditions, intensity: number = 0.5): Element[] {
	const elements: Element[] = [];

	/* Couleur du brouillard */
	const fogBase = Math.floor(200 + (1 - intensity) * 55); // 200-255
	const fogColor = { r: fogBase, g: fogBase, b: fogBase + 10 };

	/* Couches de brouillard */
	const layers = [
		{ y: HORIZON_Y - 30, height: 40, opacity: 0.3 },
		{ y: HORIZON_Y + 10, height: 50, opacity: 0.5 },
		{ y: HORIZON_Y + 60, height: 60, opacity: 0.7 },
	];

	for (const layer of layers) {
		// Ajuste la couleur selon l'opacité de la couche
		const layerBrightness = Math.floor(fogBase * (1 - layer.opacity * intensity * 0.3));
		const layerColor = { r: layerBrightness, g: layerBrightness, b: layerBrightness + 5 };

		elements.push(rectangle(0, layer.y, CANVAS_WIDTH, layer.height, layerColor));
	}

	return elements;
}
