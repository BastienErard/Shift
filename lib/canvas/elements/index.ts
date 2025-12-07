// ============================================================================
// MAISON
// ============================================================================

export { createHouse, createChimneySmoke } from "./house";

// ============================================================================
// ARBRES ET VÉGÉTATION
// ============================================================================

export {
	createTree,
	createTrees,
	createBush,
	createBushes,
	createForest,
	createBackgroundTree,
} from "./tree";

// ============================================================================
// SOL ET TERRAIN
// ============================================================================

export { createGroundTexture, createPath } from "./ground";

// ============================================================================
// RIVIÈRE
// ============================================================================

export { createRiver, createBridge } from "./river";

// ============================================================================
// CIEL (soleil, lune, étoiles, nuages)
// ============================================================================

export {
	createSun,
	createMoon,
	createStars,
	createShootingStar,
	createClouds,
	createSkyElements,
	getCloudBottomY,
} from "./sky";

// ============================================================================
// MÉTÉO (pluie, neige, éclairs)
// ============================================================================

export {
	createRain,
	createSnow,
	createLightning,
	createWeatherEffects,
	createFog,
} from "./weather";

// ============================================================================
// AMBIANCE (oiseaux, lucioles, feuilles, etc.)
// ============================================================================

export {
	createBirds,
	createFallingLeaves,
	createForegroundFallingLeaves,
	createFireflies,
	createMorningMist,
	createSpringFlowers,
	createIcicles,
	createCelestialReflection,
} from "./ambiance";
