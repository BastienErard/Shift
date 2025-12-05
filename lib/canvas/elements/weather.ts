// lib/canvas/elements/weather.ts

import type { Element } from "../types";
import type { WorldConditions } from "../conditions";
import { rectangle } from "../types";
import { getPrecipitationColor } from "../palette";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../types";
import { hasPrecipitation } from "../conditions";
import { getCloudBottomY } from "./sky";

/**
 * Crée les gouttes de pluie
 *
 * 🎓 Les gouttes partent du bas des nuages
 */
export function createRain(conditions: WorldConditions): Element[] {
	const { weather, weatherIntensity } = conditions;

	if (weather !== "rain" && weather !== "storm") {
		return [];
	}

	const elements: Element[] = [];
	const color = getPrecipitationColor(conditions);

	// Nombre de gouttes selon l'intensité
	const dropCounts = {
		light: 25,
		moderate: 50,
		heavy: 80,
	};

	const dropCount = dropCounts[weatherIntensity];

	// Dimensions des gouttes selon l'intensité
	const dropDimensions = {
		light: { width: 2, height: 12 },
		moderate: { width: 3, height: 18 },
		heavy: { width: 3, height: 25 },
	};

	const { width: dropWidth, height: dropHeight } = dropDimensions[weatherIntensity];

	// Position Y de départ : sous les nuages
	const startY = getCloudBottomY(conditions);
	const rainZone = CANVAS_HEIGHT - startY;

	// Génère les positions des gouttes
	for (let i = 0; i < dropCount; i++) {
		const baseX = (i * CANVAS_WIDTH) / dropCount;
		const offsetX = ((i * 17) % 20) - 10;
		const x = baseX + offsetX;

		// Position Y : de startY jusqu'en bas
		const y = startY + ((i * 31) % rainZone);

		elements.push(rectangle(x, y, dropWidth, dropHeight, color));
	}

	return elements;
}

/**
 * Crée les flocons de neige
 *
 * 🎓 Les flocons partent du bas des nuages
 */
export function createSnow(conditions: WorldConditions): Element[] {
	const { weather, weatherIntensity } = conditions;

	if (weather !== "snow") {
		return [];
	}

	const elements: Element[] = [];
	const color = getPrecipitationColor(conditions);

	// Nombre de flocons selon l'intensité
	const flakeCounts = {
		light: 25,
		moderate: 45,
		heavy: 75,
	};

	const flakeCount = flakeCounts[weatherIntensity];

	// Position Y de départ : sous les nuages
	const startY = getCloudBottomY(conditions);
	const snowZone = CANVAS_HEIGHT - startY;

	// Génère les flocons
	for (let i = 0; i < flakeCount; i++) {
		const baseX = (i * CANVAS_WIDTH) / flakeCount;
		const offsetX = ((i * 23) % 30) - 15;
		const x = baseX + offsetX;

		// Position Y : de startY jusqu'en bas
		const y = startY + ((i * 37) % snowZone);

		// Taille : varie entre 3 et 7 pixels
		const size = 3 + ((i * 13) % 5);

		// Flocon principal
		elements.push(rectangle(x, y, size, size, color));

		// Contour pour gros flocons
		if (size >= 5) {
			const outlineColor = { r: 200, g: 210, b: 220 };
			elements.push(rectangle(x - 1, y - 1, size + 2, size + 2, outlineColor));
			elements.push(rectangle(x, y, size, size, color));
		}
	}

	return elements;
}

/**
 * Crée un éclair
 *
 * 🎓 L'éclair part du bas des nuages
 */
export function createLightning(conditions: WorldConditions): Element[] {
	const { weather } = conditions;

	if (weather !== "storm") {
		return [];
	}

	const elements: Element[] = [];

	// Couleur de l'éclair
	const lightningColor = { r: 255, g: 255, b: 200 };

	// Position de base : sous les nuages
	const startX = CANVAS_WIDTH * 0.6;
	const startY = getCloudBottomY(conditions);

	// Forme de l'éclair en zigzag
	const segments = [
		{ x: 0, y: 0, width: 8, height: 25 },
		{ x: -15, y: 25, width: 20, height: 8 },
		{ x: -15, y: 33, width: 8, height: 30 },
		{ x: -30, y: 63, width: 20, height: 8 },
		{ x: -30, y: 71, width: 6, height: 35 },
		{ x: -40, y: 106, width: 15, height: 6 },
		{ x: -40, y: 112, width: 5, height: 25 },
	];

	// Lueur derrière l'éclair
	const glowColor = { r: 200, g: 200, b: 255 };
	elements.push(rectangle(startX - 5, startY - 5, 18, 35, glowColor));

	// Segments de l'éclair
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

	return elements;
}

/**
 * Crée tous les effets météorologiques
 */
export function createWeatherEffects(conditions: WorldConditions): Element[] {
	if (!hasPrecipitation(conditions)) {
		return [];
	}

	const elements: Element[] = [];

	elements.push(...createRain(conditions));
	elements.push(...createSnow(conditions));
	elements.push(...createLightning(conditions));

	return elements;
}

/**
 * Crée du brouillard
 */
export function createFog(conditions: WorldConditions, intensity: number = 0.5): Element[] {
	const elements: Element[] = [];

	const fogBase = Math.floor(200 + (1 - intensity) * 55);
	const fogColor = { r: fogBase, g: fogBase, b: fogBase + 10 };

	const HORIZON_Y = CANVAS_HEIGHT * 0.4;

	const layers = [
		{ y: HORIZON_Y - 30, height: 40, opacity: 0.3 },
		{ y: HORIZON_Y + 10, height: 50, opacity: 0.5 },
		{ y: HORIZON_Y + 60, height: 60, opacity: 0.7 },
	];

	for (const layer of layers) {
		const layerBrightness = Math.floor(fogBase * (1 - layer.opacity * intensity * 0.3));
		const layerColor = { r: layerBrightness, g: layerBrightness, b: layerBrightness + 5 };

		elements.push(rectangle(0, layer.y, CANVAS_WIDTH, layer.height, layerColor));
	}

	return elements;
}
