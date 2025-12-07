// lib/canvas/elements/weather/rain.ts

import type { Element } from "../../types";
import type { WorldConditions } from "../../conditions";
import { rectangle, CANVAS_WIDTH, CANVAS_HEIGHT } from "../../types";
import { getPrecipitationColor } from "../../palette";

// Les précipitations commencent depuis le haut de l'écran
const PRECIPITATION_START_Y = 0;

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
