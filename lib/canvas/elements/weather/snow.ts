// lib/canvas/elements/weather/snow.ts

import type { Element } from "../../types";
import type { WorldConditions } from "../../conditions";
import { rectangle, CANVAS_WIDTH, CANVAS_HEIGHT } from "../../types";
import { getPrecipitationColor } from "../../palette";

// Les précipitations commencent depuis le haut de l'écran
const PRECIPITATION_START_Y = 0;

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
