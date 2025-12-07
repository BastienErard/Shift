// lib/canvas/elements/sky/index.ts

import type { Element } from "../../types";
import type { WorldConditions } from "../../conditions";
import { isNight } from "../../conditions";

// Ré-exports depuis les sous-modules
export { createSun } from "./sun";
export { createMoon } from "./moon";
export { createStars, createShootingStar } from "./stars";
export { createClouds, getCloudBottomY } from "./clouds";

// Import pour createSkyElements
import { createSun } from "./sun";
import { createMoon } from "./moon";
import { createStars } from "./stars";
import { createClouds } from "./clouds";

/**
 * Crée tous les éléments du ciel
 */
export function createSkyElements(
	conditions: WorldConditions,
	cloudCover?: number,
	animationOffset: number = 0
): Element[] {
	const elements: Element[] = [];

	// Soleil ou Lune
	if (isNight(conditions)) {
		elements.push(...createMoon(conditions));
		elements.push(...createStars(conditions));
	} else {
		elements.push(...createSun(conditions));
	}

	// Nuages avec couverture dynamique et animation
	elements.push(...createClouds(conditions, cloudCover, animationOffset));

	return elements;
}
