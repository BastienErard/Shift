// lib/canvas/elements/weather.ts

import type { Element } from "../types";
import type { WorldConditions } from "../conditions";
import { rectangle } from "../types";
import { getPrecipitationColor } from "../palette";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../types";
import { hasPrecipitation } from "../conditions";
import { getCloudBottomY } from "./sky";

// Les précipitations commencent depuis le haut de l'écran
const PRECIPITATION_START_Y = 0;

// 🆕 Séquence de timings d'éclairs pré-générée (fixe)
// Format: [frameStart, duration, xPosition, shapeIndex, size]
const LIGHTNING_SEQUENCE: Array<[number, number, number, number, number]> = [
	[120, 18, 0.25, 0, 1.0],
	[320, 15, 0.65, 2, 0.85],
	[480, 20, 0.45, 1, 1.1],
	[750, 18, 0.75, 3, 0.9],
	[780, 15, 0.35, 4, 0.8], // Burst proche
	[1100, 20, 0.55, 0, 1.05],
	[1450, 18, 0.2, 2, 0.95],
	[1650, 15, 0.8, 1, 0.85],
	[1900, 20, 0.4, 3, 1.15],
	[2200, 18, 0.7, 4, 0.9],
	[2230, 15, 0.5, 0, 0.8], // Burst proche
	[2550, 20, 0.3, 2, 1.0],
	[2900, 18, 0.85, 1, 0.95],
	[3250, 15, 0.6, 3, 0.85],
	[3600, 20, 0.25, 4, 1.1],
];

// Cycle total de la séquence
const SEQUENCE_CYCLE_LENGTH = 3800;

/**
 * Crée les gouttes de pluie animées avec effet diagonal
 */
export function createRain(conditions: WorldConditions, animationOffset: number = 0): Element[] {
	const { weather, weatherIntensity } = conditions;

	if (weather !== "rain" && weather !== "storm") {
		return [];
	}

	const elements: Element[] = [];
	const color = getPrecipitationColor(conditions);

	const dropCounts = {
		light: 30,
		moderate: 60,
		heavy: 100,
	};

	const dropCount = dropCounts[weatherIntensity];

	const dropDimensions = {
		light: { width: 2, height: 12 },
		moderate: { width: 3, height: 18 },
		heavy: { width: 3, height: 25 },
	};

	const { width: dropWidth, height: dropHeight } = dropDimensions[weatherIntensity];

	// La pluie commence depuis le haut de l'écran (Y=0)
	const startY = PRECIPITATION_START_Y;
	const totalFallDistance = CANVAS_HEIGHT + dropHeight * 2;

	const fallSpeeds = {
		light: 4,
		moderate: 6,
		heavy: 9,
	};

	const baseFallSpeed = fallSpeeds[weatherIntensity];

	const windSpeed = conditions.windSpeed || 0;
	const windDirection = conditions.windDirection || 0;

	const radians = (windDirection * Math.PI) / 180;
	const windComponent = -Math.sin(radians);

	const windStrength = Math.min(windSpeed / 50, 1);
	const rainSlant = windComponent * windStrength * 0.5;

	for (let i = 0; i < dropCount; i++) {
		const baseX = ((i * 73 + i * i * 31) % (CANVAS_WIDTH + 200)) - 100;
		const initialOffset = (((i * 97 + i * i * 53) % 1000) / 1000) * totalFallDistance;
		const speedVariation = 1 + ((i * 13) % 10) / 20;

		const absoluteY = initialOffset + animationOffset * baseFallSpeed * speedVariation;
		const y = startY + (absoluteY % totalFallDistance);
		const fallDistance = absoluteY % totalFallDistance;
		const x = baseX + fallDistance * rainSlant;

		if (
			y >= startY - dropHeight &&
			y <= CANVAS_HEIGHT &&
			x >= -dropWidth &&
			x <= CANVAS_WIDTH + dropWidth
		) {
			// z-index "sky" pour que la pluie soit derrière les nuages
			elements.push(rectangle(x, y, dropWidth, dropHeight, color, "sky"));
		}
	}

	return elements;
}

/**
 * Crée les flocons de neige animés
 */
export function createSnow(conditions: WorldConditions, animationOffset: number = 0): Element[] {
	const { weather, weatherIntensity } = conditions;

	if (weather !== "snow") {
		return [];
	}

	const elements: Element[] = [];
	const color = getPrecipitationColor(conditions);

	const flakeCounts = {
		light: 30,
		moderate: 50,
		heavy: 80,
	};

	const flakeCount = flakeCounts[weatherIntensity];

	// La neige commence depuis le haut de l'écran (Y=0)
	const startY = PRECIPITATION_START_Y;
	const totalFallDistance = CANVAS_HEIGHT + 50;

	const fallSpeeds = {
		light: 0.8,
		moderate: 1.2,
		heavy: 1.8,
	};

	const baseFallSpeed = fallSpeeds[weatherIntensity];

	const windSpeed = conditions.windSpeed || 0;
	const windDirection = conditions.windDirection || 0;

	const radians = (windDirection * Math.PI) / 180;
	const windComponent = -Math.sin(radians);

	const windStrength = Math.min(windSpeed / 50, 1);
	const snowDrift = windComponent * windStrength * 0.3;

	for (let i = 0; i < flakeCount; i++) {
		const baseX = ((i * 67 + i * i * 41) % (CANVAS_WIDTH + 200)) - 100;
		const initialOffset = (((i * 89 + i * i * 37) % 1000) / 1000) * totalFallDistance;
		const speedVariation = 0.7 + ((i * 19) % 10) / 15;

		const absoluteY = initialOffset + animationOffset * baseFallSpeed * speedVariation;
		const y = startY + (absoluteY % totalFallDistance);

		const oscillationFrequency = 0.015 + (i % 5) * 0.005;
		const oscillationAmplitude = 8 + (i % 7) * 2;
		const oscillation =
			Math.sin((absoluteY * 0.1 + i * 10) * oscillationFrequency) * oscillationAmplitude;

		const fallDistance = absoluteY % totalFallDistance;
		const windDrift = fallDistance * snowDrift;

		const x = baseX + oscillation + windDrift;
		const size = 3 + ((i * 13) % 5);

		if (y >= startY - size && y <= CANVAS_HEIGHT && x >= -size && x <= CANVAS_WIDTH + size) {
			// z-index "sky" pour que la neige soit derrière les nuages
			elements.push(rectangle(x, y, size, size, color, "sky"));

			if (size >= 5) {
				const outlineColor = { r: 200, g: 210, b: 220 };
				elements.push(rectangle(x - 1, y - 1, size + 2, size + 2, outlineColor, "sky"));
				elements.push(rectangle(x, y, size, size, color, "sky"));
			}
		}
	}

	return elements;
}

/**
 * Crée des éclairs animés avec séquence pré-générée
 */
export function createLightning(
	conditions: WorldConditions,
	animationOffset: number = 0
): Element[] {
	const { weather } = conditions;

	if (weather !== "storm") {
		return [];
	}

	// 🆕 DEBUG : Affiche dans la console
	const cycleLength = 1800;
	const cyclePosition = animationOffset % cycleLength;

	const elements: Element[] = [];
	const startY = getCloudBottomY(conditions);

	const lightningEvents = [
		[0, 20, 0.3, 0],
		[240, 18, 0.65, 1],
		[500, 20, 0.45, 2],
		[750, 18, 0.75, 3],
		[780, 15, 0.35, 4],
		[1050, 20, 0.55, 0],
		[1350, 18, 0.25, 1],
		[1600, 20, 0.8, 2],
	];

	// Formes de l'éclair
	const lightningShapes = [
		[
			{ x: 0, y: 0, width: 8, height: 30 },
			{ x: -18, y: 30, width: 24, height: 8 },
			{ x: -18, y: 38, width: 8, height: 35 },
			{ x: -32, y: 73, width: 22, height: 8 },
			{ x: -32, y: 81, width: 7, height: 40 },
		],
		[
			{ x: 0, y: 0, width: 6, height: 28 },
			{ x: 12, y: 28, width: 18, height: 6 },
			{ x: 12, y: 34, width: 6, height: 32 },
			{ x: 24, y: 66, width: 16, height: 6 },
			{ x: 24, y: 72, width: 5, height: 35 },
		],
		[
			{ x: 0, y: 0, width: 7, height: 26 },
			{ x: -14, y: 26, width: 20, height: 7 },
			{ x: -14, y: 33, width: 7, height: 30 },
			{ x: 6, y: 63, width: 18, height: 7 },
			{ x: 6, y: 70, width: 6, height: 38 },
		],
		[
			{ x: 0, y: 0, width: 8, height: 25 },
			{ x: -15, y: 25, width: 20, height: 8 },
			{ x: -15, y: 33, width: 8, height: 30 },
		],
		[
			{ x: 0, y: 0, width: 7, height: 22 },
			{ x: 10, y: 22, width: 16, height: 7 },
			{ x: 10, y: 29, width: 7, height: 24 },
			{ x: -8, y: 53, width: 18, height: 7 },
			{ x: -8, y: 60, width: 7, height: 26 },
		],
	];

	// Parcourt les événements
	for (const event of lightningEvents) {
		const [frameStart, duration, xPos, shapeIdx] = event;

		if (cyclePosition >= frameStart && cyclePosition < frameStart + duration) {
			const startX = CANVAS_WIDTH * xPos;
			const segments = lightningShapes[shapeIdx];

			const lightningColor = { r: 255, g: 255, b: 220 };
			const glowColor = { r: 220, g: 220, b: 255 };

			elements.push(rectangle(startX - 10, startY - 10, 35, 60, glowColor));

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
		}
	}

	return elements;
}

/**
 * Crée tous les effets météorologiques
 */
export function createWeatherEffects(
	conditions: WorldConditions,
	animationOffset: number = 0
): Element[] {
	const elements: Element[] = [];

	// Pluie et neige seulement si précipitations
	if (hasPrecipitation(conditions)) {
		elements.push(...createRain(conditions, animationOffset));
		elements.push(...createSnow(conditions, animationOffset));
	}

	// 🆕 Éclairs indépendants (même sans pluie)
	if (conditions.weather === "storm") {
		elements.push(...createLightning(conditions, animationOffset));
	}

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
