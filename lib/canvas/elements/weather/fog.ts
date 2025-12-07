// lib/canvas/elements/weather/fog.ts

import type { Element } from "../../types";
import type { WorldConditions } from "../../conditions";
import { rectangle, CANVAS_WIDTH, CANVAS_HEIGHT } from "../../types";

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
