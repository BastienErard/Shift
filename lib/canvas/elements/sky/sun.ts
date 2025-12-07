// lib/canvas/elements/sky/sun.ts

import type { Element } from "../../types";
import type { WorldConditions } from "../../conditions";
import { circle, CANVAS_WIDTH, CANVAS_HEIGHT, HORIZON_Y } from "../../types";
import { isNight, isGoldenHour } from "../../conditions";

/**
 * Crée le soleil
 */
export function createSun(conditions: WorldConditions): Element[] {
	// Pas de soleil la nuit
	if (isNight(conditions)) {
		return [];
	}

	const elements: Element[] = [];

	// Taille du soleil (plus gros à l'aube/crépuscule pour effet de perspective)
	const radius = isGoldenHour(conditions) ? 55 : 40;

	// Couleurs du soleil selon le moment
	let sunColor: { r: number; g: number; b: number };
	if (conditions.timeOfDay === "dawn") {
		sunColor = { r: 255, g: 150, b: 100 }; // Orange rosé
	} else if (conditions.timeOfDay === "dusk") {
		sunColor = { r: 255, g: 100, b: 60 }; // Rouge orangé
	} else {
		sunColor = { r: 255, g: 220, b: 50 }; // Jaune vif
	}

	// Positions du soleil selon le moment
	const sunPositions: Record<string, { x: number; y: number }> = {
		dawn: { x: CANVAS_WIDTH * 0.08, y: HORIZON_Y - radius * 0.3 },
		morning: { x: CANVAS_WIDTH * 0.25, y: CANVAS_HEIGHT * 0.18 },
		noon: { x: CANVAS_WIDTH * 0.5, y: CANVAS_HEIGHT * 0.08 },
		afternoon: { x: CANVAS_WIDTH * 0.75, y: CANVAS_HEIGHT * 0.18 },
		dusk: { x: CANVAS_WIDTH * 0.92, y: HORIZON_Y - radius * 0.3 },
	};

	const position = sunPositions[conditions.timeOfDay] || sunPositions.noon;

	// Soleil simple sans halo
	elements.push(circle(position.x, position.y, radius, sunColor, "sky"));

	return elements;
}
