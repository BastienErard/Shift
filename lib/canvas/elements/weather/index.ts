// lib/canvas/elements/weather/index.ts

import type { Element } from "../../types";
import type { WorldConditions } from "../../conditions";
import { hasPrecipitation } from "../../conditions";

// Ré-exports depuis les sous-modules
export { createRain } from "./rain";
export { createSnow } from "./snow";
export { createLightning } from "./lightning";
export { createFog } from "./fog";

// Import pour createWeatherEffects
import { createRain } from "./rain";
import { createSnow } from "./snow";
import { createLightning } from "./lightning";

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

	// Éclairs indépendants (même sans pluie)
	if (conditions.weather === "storm") {
		elements.push(...createLightning(conditions, animationOffset));
	}

	return elements;
}
