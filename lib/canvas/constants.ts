// lib/canvas/constants.ts
// Constantes centralisées pour le moteur de rendu

// ============================================================================
// DIMENSIONS DU CANVAS
// ============================================================================

/** Largeur affichée (CSS pixels) */
export const DISPLAY_WIDTH = 400;

/** Hauteur affichée (CSS pixels) */
export const DISPLAY_HEIGHT = 300;

/** Ratio de pixels pour écrans haute résolution */
export const PIXEL_RATIO = 2;

/** Largeur réelle du canvas (pixels physiques) */
export const CANVAS_WIDTH = DISPLAY_WIDTH * PIXEL_RATIO;

/** Hauteur réelle du canvas (pixels physiques) */
export const CANVAS_HEIGHT = DISPLAY_HEIGHT * PIXEL_RATIO;

// ============================================================================
// POSITIONS CLÉS
// ============================================================================

/** Position Y de l'horizon (ligne sol/ciel) - 40% depuis le haut */
export const HORIZON_Y = Math.floor(CANVAS_HEIGHT * 0.4);

/** Position Y de la rivière */
export const RIVER_Y = CANVAS_HEIGHT - 90;

/** Hauteur de la rivière */
export const RIVER_HEIGHT = 50;

// ============================================================================
// MAISON
// ============================================================================

/** Position X de base de la maison */
export const HOUSE_BASE_X = Math.floor(CANVAS_WIDTH * 0.42);

/** Position Y de base de la maison */
export const HOUSE_BASE_Y = HORIZON_Y + 70;

/** Dimensions de la maison */
export const HOUSE_DIMENSIONS = {
	wall: { width: 140, height: 90 },
	roof: { width: 170, height: 35 },
	roofTop: { width: 60, height: 20 },
	door: { width: 28, height: 55 },
	window: { width: 26, height: 26 },
	chimney: { width: 24, height: 45 },
	planter: { width: 30, height: 12 },
} as const;

// ============================================================================
// ARBRES
// ============================================================================

/** Positions des arbres */
export const TREE_POSITIONS = {
	behindHouse: { x: 520, scale: 0.9 },
	leftOfHouse: { x: 120, scale: 1.0 },
	foreground: { x: 680, scale: 1.2, y: CANVAS_HEIGHT - 28 },
} as const;

// ============================================================================
// MÉTÉO
// ============================================================================

/** Position Y de départ des précipitations */
export const PRECIPITATION_START_Y = 0;

/** Nombre de gouttes de pluie selon l'intensité */
export const RAIN_DROP_COUNTS = {
	light: 30,
	moderate: 60,
	heavy: 100,
} as const;

/** Dimensions des gouttes selon l'intensité */
export const RAIN_DROP_DIMENSIONS = {
	light: { width: 2, height: 12 },
	moderate: { width: 3, height: 18 },
	heavy: { width: 3, height: 25 },
} as const;

/** Vitesse de chute de la pluie */
export const RAIN_FALL_SPEEDS = {
	light: 4,
	moderate: 6,
	heavy: 9,
} as const;

/** Nombre de flocons de neige selon l'intensité */
export const SNOW_FLAKE_COUNTS = {
	light: 30,
	moderate: 50,
	heavy: 80,
} as const;

/** Vitesse de chute de la neige */
export const SNOW_FALL_SPEEDS = {
	light: 0.8,
	moderate: 1.2,
	heavy: 1.8,
} as const;

// ============================================================================
// ANIMATION
// ============================================================================

/** Durée d'un cycle d'éclair (frames) */
export const LIGHTNING_CYCLE_LENGTH = 1800;

/** Durée d'un cycle d'étoile filante (frames) */
export const SHOOTING_STAR_CYCLE_LENGTH = 600;

/** Durée de l'animation d'une étoile filante (frames) */
export const SHOOTING_STAR_DURATION = 60;

// ============================================================================
// TEMPÉRATURES SEUILS
// ============================================================================

/** Température en dessous de laquelle la fumée apparaît (°C) */
export const SMOKE_TEMPERATURE_THRESHOLD = 15;

/** Température en dessous de laquelle la rivière gèle (°C) */
export const RIVER_FREEZE_TEMPERATURE = -5;

/** Température en dessous de laquelle les glaçons apparaissent (°C) */
export const ICICLE_TEMPERATURE_THRESHOLD = 0;

// ============================================================================
// ÉLÉMENTS D'AMBIANCE
// ============================================================================

/** Nombre d'oiseaux selon la saison */
export const BIRD_COUNTS = {
	spring: 5,
	summer: 4,
	autumn: 3,
	winter: 1,
} as const;

/** Nombre de lucioles selon la saison */
export const FIREFLY_COUNTS = {
	summer: 12,
	spring: 6,
} as const;

/** Nombre de feuilles qui tombent */
export const FALLING_LEAVES_COUNT = {
	normal: 15,
	rainy: 8,
} as const;
