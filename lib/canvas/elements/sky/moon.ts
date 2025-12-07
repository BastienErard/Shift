// lib/canvas/elements/sky/moon.ts

import type { Element } from "../../types";
import type { WorldConditions } from "../../conditions";
import { circle, CANVAS_WIDTH } from "../../types";
import { CELESTIAL_PALETTE } from "../../palette";
import { isNight } from "../../conditions";

/**
 * Crée la lune
 */
export function createMoon(conditions: WorldConditions): Element[] {
	// Lune uniquement la nuit
	if (!isNight(conditions)) {
		return [];
	}

	const elements: Element[] = [];

	const moonX = CANVAS_WIDTH - 120;
	const moonY = 80;
	const moonRadius = 35;

	// Lune principale avec z-index "sky"
	elements.push(circle(moonX, moonY, moonRadius, CELESTIAL_PALETTE.moon, "sky"));

	// Cratères (petits cercles plus sombres) avec z-index "sky"
	const craterColor = { r: 200, g: 200, b: 180 };

	elements.push(
		circle(moonX - 10, moonY - 8, 6, craterColor, "sky"),
		circle(moonX + 8, moonY + 5, 4, craterColor, "sky"),
		circle(moonX - 5, moonY + 12, 5, craterColor, "sky")
	);

	return elements;
}
