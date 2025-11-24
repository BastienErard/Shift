import type { Color } from "./types";
import type { WorldConditions, TimeOfDay, Season } from "./conditions";
import { rgb } from "./types";
import { isNight, isGoldenHour, hasSnowOnGround } from "./conditions";

/* Palette de couleurs de Shift */

// ============================================================================
// COULEURS DU CIEL
// ============================================================================

/* Couleurs du ciel selon le moment de la journée */
const SKY_COLORS: Record<TimeOfDay, Color> = {
	dawn: rgb(255, 183, 147), // Orange rosé
	morning: rgb(176, 226, 255), // Bleu clair doux
	noon: rgb(135, 206, 235), // Bleu ciel vif
	afternoon: rgb(153, 204, 255), // Bleu légèrement atténué
	dusk: rgb(255, 140, 100), // Orange intense
	night: rgb(25, 25, 112), // Bleu nuit profond
};

/* Modificateurs du ciel selon la météo */
const SKY_WEATHER_MODIFIERS: Record<string, Color> = {
	cloudy: rgb(169, 169, 169), // Gris nuageux
	rain: rgb(119, 136, 153), // Gris pluvieux
	storm: rgb(72, 72, 80), // Gris orageux sombre
	snow: rgb(200, 210, 220), // Gris bleuté neigeux
};

/* Retourne la couleur du ciel selon les conditions */
export function getSkyColor(conditions: WorldConditions): Color {
	const { timeOfDay, weather } = conditions;

	// Météo couverte : utilise la couleur météo (sauf la nuit)
	if (weather !== "clear" && !isNight(conditions)) {
		// Mélange entre couleur de base et couleur météo
		const baseColor = SKY_COLORS[timeOfDay];
		const weatherColor = SKY_WEATHER_MODIFIERS[weather] || baseColor;

		// Plus la météo est "intense", plus on utilise la couleur météo
		return lerpColorSimple(baseColor, weatherColor, 0.6);
	}

	return SKY_COLORS[timeOfDay];
}

// ============================================================================
// COULEURS DU SOL
// ============================================================================

/* Couleurs du sol selon la saison */
const GROUND_COLORS: Record<Season, Color> = {
	spring: rgb(124, 185, 82), // Vert printanier vif
	summer: rgb(34, 139, 34), // Vert forêt
	autumn: rgb(139, 90, 43), // Brun automnal
	winter: rgb(34, 100, 34), // Vert foncé (sous la neige potentielle)
};

/* Couleur du sol enneigé */
const SNOW_GROUND_COLOR: Color = rgb(240, 248, 255); // Blanc neige

/* Modificateur de sol pour la nuit (assombrit) */
const NIGHT_GROUND_MODIFIER = 0.4; // 40% de luminosité

/* Retourne la couleur du sol selon les conditions */
export function getGroundColor(conditions: WorldConditions): Color {
	const { season } = conditions;

	// Sol enneigé en hiver
	if (hasSnowOnGround(conditions)) {
		return SNOW_GROUND_COLOR;
	}

	let color = GROUND_COLORS[season];

	// Assombrit la nuit
	if (isNight(conditions)) {
		color = darkenColor(color, NIGHT_GROUND_MODIFIER);
	}

	// Légèrement plus sombre si pluie (sol mouillé)
	if (conditions.weather === "rain" || conditions.weather === "storm") {
		color = darkenColor(color, 0.8);
	}

	return color;
}

// ============================================================================
// COULEURS DE LA MAISON
// ============================================================================

/* Palette de la maison */
export const HOUSE_PALETTE = {
	wall: {
		base: rgb(210, 180, 140), // Beige/brun clair
		night: rgb(105, 90, 70), // Assombri la nuit
	},
	roof: {
		base: rgb(178, 34, 34), // Rouge brique
		night: rgb(89, 17, 17), // Assombri la nuit
	},
	roofTop: {
		base: rgb(139, 0, 0), // Rouge foncé (faîtage)
		night: rgb(69, 0, 0),
	},
	door: {
		base: rgb(101, 67, 33), // Brun foncé
		night: rgb(51, 34, 17),
	},
	window: {
		day: rgb(135, 206, 250), // Bleu ciel (reflet)
		night: rgb(255, 215, 0), // Jaune chaud (lumière intérieure)
		goldenHour: rgb(255, 200, 150), // Reflet doré
	},
	chimney: {
		base: rgb(128, 64, 64), // Brique sombre
		night: rgb(64, 32, 32),
	},
};

/* Retourne les couleurs de la maison selon les conditions */
export function getHouseColors(conditions: WorldConditions) {
	const night = isNight(conditions);
	const golden = isGoldenHour(conditions);

	return {
		wall: night ? HOUSE_PALETTE.wall.night : HOUSE_PALETTE.wall.base,
		roof: night ? HOUSE_PALETTE.roof.night : HOUSE_PALETTE.roof.base,
		roofTop: night ? HOUSE_PALETTE.roofTop.night : HOUSE_PALETTE.roofTop.base,
		door: night ? HOUSE_PALETTE.door.night : HOUSE_PALETTE.door.base,
		window: night
			? HOUSE_PALETTE.window.night
			: golden
				? HOUSE_PALETTE.window.goldenHour
				: HOUSE_PALETTE.window.day,
		chimney: night ? HOUSE_PALETTE.chimney.night : HOUSE_PALETTE.chimney.base,
	};
}

// ============================================================================
// COULEURS DE L'ARBRE
// ============================================================================

/* Palette de l'arbre selon la saison */
export const TREE_PALETTE = {
	trunk: {
		base: rgb(101, 67, 33), // Brun
		night: rgb(51, 34, 17), // Brun très foncé
	},
	foliage: {
		spring: [rgb(144, 238, 144), rgb(124, 205, 124), rgb(100, 180, 100)], // Verts clairs
		summer: [rgb(34, 139, 34), rgb(50, 205, 50), rgb(34, 139, 34)], // Verts vifs
		autumn: [rgb(255, 140, 0), rgb(255, 100, 0), rgb(200, 80, 0)], // Oranges
		winter: [rgb(139, 137, 137), rgb(120, 120, 120), rgb(100, 100, 100)], // Gris (branches nues)
	},
};

/* Retourne les couleurs de l'arbre selon les conditions */
export function getTreeColors(conditions: WorldConditions) {
	const { season } = conditions;
	const night = isNight(conditions);

	let trunk = TREE_PALETTE.trunk.base;
	let foliage = TREE_PALETTE.foliage[season];

	if (night) {
		trunk = TREE_PALETTE.trunk.night;
		// Assombrit le feuillage la nuit
		foliage = foliage.map((color) => darkenColor(color, 0.4));
	}

	return { trunk, foliage };
}

// ============================================================================
// COULEURS DU CIEL (SOLEIL, LUNE, ÉTOILES, NUAGES)
// ============================================================================

/* Palette des éléments célestes */
export const CELESTIAL_PALETTE = {
	sun: {
		dawn: rgb(255, 160, 100), // Orange lever de soleil
		day: rgb(255, 223, 0), // Jaune vif
		dusk: rgb(255, 100, 50), // Orange coucher
	},
	moon: rgb(245, 245, 220), // Blanc cassé / beige clair
	stars: rgb(255, 255, 255), // Blanc pur
	starsDim: rgb(200, 200, 200), // Blanc atténué (étoiles lointaines)
	clouds: {
		day: rgb(255, 255, 255), // Blanc
		golden: rgb(255, 200, 150), // Teinté doré
		night: rgb(60, 60, 80), // Gris bleuté sombre
		rain: rgb(128, 128, 128), // Gris
		storm: rgb(80, 80, 90), // Gris foncé
	},
};

/* Retourne la couleur du soleil selon les conditions */
export function getSunColor(conditions: WorldConditions): Color {
	const { timeOfDay } = conditions;

	if (timeOfDay === "dawn") return CELESTIAL_PALETTE.sun.dawn;
	if (timeOfDay === "dusk") return CELESTIAL_PALETTE.sun.dusk;

	return CELESTIAL_PALETTE.sun.day;
}

/* Retourne la couleur des nuages selon les conditions */
export function getCloudColor(conditions: WorldConditions): Color {
	const { weather } = conditions;

	if (isNight(conditions)) return CELESTIAL_PALETTE.clouds.night;
	if (isGoldenHour(conditions)) return CELESTIAL_PALETTE.clouds.golden;
	if (weather === "storm") return CELESTIAL_PALETTE.clouds.storm;
	if (weather === "rain" || weather === "cloudy") return CELESTIAL_PALETTE.clouds.rain;

	return CELESTIAL_PALETTE.clouds.day;
}

// ============================================================================
// COULEURS DES PRÉCIPITATIONS
// ============================================================================

/* Palette des précipitations */
export const PRECIPITATION_PALETTE = {
	rain: rgb(173, 216, 230), // Bleu clair
	rainHeavy: rgb(100, 149, 237), // Bleu plus intense
	snow: rgb(255, 255, 255), // Blanc
	snowSoft: rgb(220, 230, 240), // Blanc bleuté
};

/* Retourne la couleur des précipitations selon les conditions */
export function getPrecipitationColor(conditions: WorldConditions): Color {
	const { weather, weatherIntensity } = conditions;

	if (weather === "snow") {
		return weatherIntensity === "heavy"
			? PRECIPITATION_PALETTE.snow
			: PRECIPITATION_PALETTE.snowSoft;
	}

	return weatherIntensity === "heavy"
		? PRECIPITATION_PALETTE.rainHeavy
		: PRECIPITATION_PALETTE.rain;
}

// ============================================================================
// FONCTIONS UTILITAIRES INTERNES
// ============================================================================

/**
 * Interpole simplement entre deux couleurs
 *
 * @param from Couleur de départ
 * @param to Couleur d'arrivée
 * @param t Facteur (0 = from, 1 = to)
 */
function lerpColorSimple(from: Color, to: Color, t: number): Color {
	return {
		r: Math.round(from.r + (to.r - from.r) * t),
		g: Math.round(from.g + (to.g - from.g) * t),
		b: Math.round(from.b + (to.b - from.b) * t),
	};
}

/**
 * Assombrit une couleur
 *
 * @param color Couleur à assombrir
 * @param factor Facteur (0 = noir, 1 = original)
 */
function darkenColor(color: Color, factor: number): Color {
	return {
		r: Math.round(color.r * factor),
		g: Math.round(color.g * factor),
		b: Math.round(color.b * factor),
	};
}
