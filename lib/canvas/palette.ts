import type { Color } from "./types";
import type { WorldConditions, TimeOfDay, Season } from "./conditions";
import { rgb } from "./types";
import { isNight, isGoldenHour, hasSnowOnGround } from "./conditions";

/* Palette de couleurs enrichie de Shift */

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
// COULEURS DU SOL - ENRICHIES AVEC NUANCES
// ============================================================================

/* Palette de sol enrichie par saison */
export const GROUND_PALETTE: Record<
	Season,
	{
		base: Color;
		light: Color;
		dark: Color;
		accent: Color;
	}
> = {
	spring: {
		base: rgb(124, 185, 82), // Vert printanier vif
		light: rgb(152, 210, 105), // Vert clair
		dark: rgb(85, 140, 55), // Vert foncé
		accent: rgb(180, 220, 140), // Vert très clair (nouvelles pousses)
	},
	summer: {
		base: rgb(34, 139, 34), // Vert forêt
		light: rgb(60, 165, 60), // Vert moyen
		dark: rgb(20, 100, 20), // Vert très foncé
		accent: rgb(90, 180, 90), // Vert lumineux
	},
	autumn: {
		base: rgb(139, 90, 43), // Brun automnal
		light: rgb(180, 130, 70), // Brun clair
		dark: rgb(100, 65, 30), // Brun foncé
		accent: rgb(160, 110, 50), // Brun doré
	},
	winter: {
		base: rgb(34, 100, 34), // Vert foncé (sous la neige potentielle)
		light: rgb(50, 120, 50), // Vert moyen froid
		dark: rgb(20, 70, 20), // Vert très foncé
		accent: rgb(70, 130, 70), // Vert grisé
	},
};

/* Couleurs du sol enneigé */
export const SNOW_PALETTE = {
	base: rgb(240, 248, 255), // Blanc neige
	light: rgb(255, 255, 255), // Blanc pur
	shadow: rgb(200, 215, 230), // Ombre bleue
	accent: rgb(220, 235, 250), // Neige brillante
};

/* Modificateur de sol pour la nuit (assombrit) */
const NIGHT_GROUND_MODIFIER = 0.4;

/* Retourne la couleur du sol selon les conditions */
export function getGroundColor(conditions: WorldConditions): Color {
	const { season } = conditions;

	// Sol enneigé en hiver
	if (hasSnowOnGround(conditions)) {
		return SNOW_PALETTE.base;
	}

	let color = GROUND_PALETTE[season].base;

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

/* Retourne la palette complète du sol selon les conditions */
export function getGroundPalette(conditions: WorldConditions): {
	base: Color;
	light: Color;
	dark: Color;
	accent: Color;
} {
	const { season } = conditions;

	if (hasSnowOnGround(conditions)) {
		return {
			base: SNOW_PALETTE.base,
			light: SNOW_PALETTE.light,
			dark: SNOW_PALETTE.shadow,
			accent: SNOW_PALETTE.accent,
		};
	}

	let palette = { ...GROUND_PALETTE[season] };

	if (isNight(conditions)) {
		palette = {
			base: darkenColor(palette.base, NIGHT_GROUND_MODIFIER),
			light: darkenColor(palette.light, NIGHT_GROUND_MODIFIER),
			dark: darkenColor(palette.dark, NIGHT_GROUND_MODIFIER),
			accent: darkenColor(palette.accent, NIGHT_GROUND_MODIFIER),
		};
	}

	if (conditions.weather === "rain" || conditions.weather === "storm") {
		palette = {
			base: darkenColor(palette.base, 0.8),
			light: darkenColor(palette.light, 0.8),
			dark: darkenColor(palette.dark, 0.8),
			accent: darkenColor(palette.accent, 0.8),
		};
	}

	return palette;
}

// ============================================================================
// COULEURS DE LA MAISON - COTTAGE RUSTIQUE
// ============================================================================

/* Palette de la maison cottage */
export const HOUSE_PALETTE = {
	// Murs en pierre
	stone: {
		base: rgb(160, 150, 140), // Pierre grise
		light: rgb(185, 175, 165), // Pierre claire
		dark: rgb(120, 110, 100), // Pierre foncée
		night: rgb(80, 75, 70),
	},
	// Bois (poutres, volets)
	wood: {
		base: rgb(101, 67, 33), // Brun bois
		light: rgb(140, 100, 60), // Bois clair
		dark: rgb(70, 45, 20), // Bois foncé
		night: rgb(50, 33, 17),
	},
	// Toit en chaume/tuiles
	roof: {
		base: rgb(139, 119, 101), // Chaume/tuiles brun
		light: rgb(165, 145, 125), // Chaume clair
		dark: rgb(100, 85, 70), // Chaume foncé
		night: rgb(70, 60, 50),
	},
	roofTop: {
		base: rgb(120, 100, 80), // Faîtage
		night: rgb(60, 50, 40),
	},
	// Porte
	door: {
		base: rgb(90, 55, 25), // Porte en bois foncé
		light: rgb(120, 80, 45),
		night: rgb(45, 28, 12),
	},
	// Fenêtres
	window: {
		day: rgb(135, 206, 250), // Reflet ciel
		night: rgb(255, 200, 100), // Lumière chaude
		goldenHour: rgb(255, 200, 150), // Reflet doré
		frame: rgb(240, 235, 220), // Cadre blanc cassé
		frameNight: rgb(120, 117, 110),
	},
	// Cheminée
	chimney: {
		base: rgb(140, 90, 70), // Brique
		dark: rgb(100, 65, 50),
		night: rgb(70, 45, 35),
	},
	// Éléments décoratifs
	details: {
		flower: rgb(220, 80, 100), // Fleurs roses
		flowerLeaf: rgb(60, 130, 60), // Feuilles
		planter: rgb(160, 82, 45), // Jardinière terre cuite
	},
};

/* Retourne les couleurs de la maison selon les conditions */
export function getHouseColors(conditions: WorldConditions) {
	const night = isNight(conditions);
	const golden = isGoldenHour(conditions);

	return {
		// Murs en pierre
		wall: night ? HOUSE_PALETTE.stone.night : HOUSE_PALETTE.stone.base,
		wallLight: night ? HOUSE_PALETTE.stone.night : HOUSE_PALETTE.stone.light,
		wallDark: night
			? darkenColor(HOUSE_PALETTE.stone.night, 0.8)
			: HOUSE_PALETTE.stone.dark,

		// Bois
		wood: night ? HOUSE_PALETTE.wood.night : HOUSE_PALETTE.wood.base,
		woodLight: night ? HOUSE_PALETTE.wood.night : HOUSE_PALETTE.wood.light,
		woodDark: night
			? darkenColor(HOUSE_PALETTE.wood.night, 0.8)
			: HOUSE_PALETTE.wood.dark,

		// Toit
		roof: night ? HOUSE_PALETTE.roof.night : HOUSE_PALETTE.roof.base,
		roofLight: night ? HOUSE_PALETTE.roof.night : HOUSE_PALETTE.roof.light,
		roofDark: night
			? darkenColor(HOUSE_PALETTE.roof.night, 0.8)
			: HOUSE_PALETTE.roof.dark,
		roofTop: night ? HOUSE_PALETTE.roofTop.night : HOUSE_PALETTE.roofTop.base,

		// Porte
		door: night ? HOUSE_PALETTE.door.night : HOUSE_PALETTE.door.base,
		doorLight: night ? HOUSE_PALETTE.door.night : HOUSE_PALETTE.door.light,

		// Fenêtres
		window: night
			? HOUSE_PALETTE.window.night
			: golden
				? HOUSE_PALETTE.window.goldenHour
				: HOUSE_PALETTE.window.day,
		windowFrame: night
			? HOUSE_PALETTE.window.frameNight
			: HOUSE_PALETTE.window.frame,

		// Cheminée
		chimney: night ? HOUSE_PALETTE.chimney.night : HOUSE_PALETTE.chimney.base,
		chimneyDark: night
			? darkenColor(HOUSE_PALETTE.chimney.night, 0.8)
			: HOUSE_PALETTE.chimney.dark,

		// Décorations
		flower: night
			? darkenColor(HOUSE_PALETTE.details.flower, 0.4)
			: HOUSE_PALETTE.details.flower,
		flowerLeaf: night
			? darkenColor(HOUSE_PALETTE.details.flowerLeaf, 0.4)
			: HOUSE_PALETTE.details.flowerLeaf,
		planter: night
			? darkenColor(HOUSE_PALETTE.details.planter, 0.4)
			: HOUSE_PALETTE.details.planter,
	};
}

// ============================================================================
// COULEURS DES ARBRES - ENRICHIES PAR SAISON
// ============================================================================

/* Palette de l'arbre selon la saison - Multiple nuances */
export const TREE_PALETTE = {
	trunk: {
		base: rgb(101, 67, 33), // Brun
		light: rgb(130, 90, 50), // Brun clair
		dark: rgb(70, 45, 20), // Brun foncé
		night: rgb(51, 34, 17),
	},
	foliage: {
		spring: {
			colors: [
				rgb(144, 238, 144), // Vert clair
				rgb(124, 205, 124), // Vert moyen
				rgb(100, 180, 100), // Vert foncé
			],
			highlight: rgb(180, 255, 180), // Reflet
			shadow: rgb(80, 150, 80), // Ombre
		},
		summer: {
			colors: [
				rgb(34, 139, 34), // Vert forêt
				rgb(50, 160, 50), // Vert vif
				rgb(40, 120, 40), // Vert profond
			],
			highlight: rgb(70, 180, 70),
			shadow: rgb(20, 90, 20),
		},
		autumn: {
			colors: [
				rgb(255, 140, 0), // Orange vif
				rgb(220, 100, 20), // Orange foncé
				rgb(180, 60, 20), // Rouge-orange
			],
			highlight: rgb(255, 180, 60),
			shadow: rgb(150, 50, 10),
		},
		winter: {
			colors: [
				rgb(139, 137, 137), // Gris (branches)
				rgb(120, 118, 118), // Gris moyen
				rgb(100, 98, 98), // Gris foncé
			],
			highlight: rgb(160, 158, 158),
			shadow: rgb(80, 78, 78),
		},
	},
};

/* Retourne les couleurs de l'arbre selon les conditions */
export function getTreeColors(conditions: WorldConditions) {
	const { season } = conditions;
	const night = isNight(conditions);

	let trunk = TREE_PALETTE.trunk.base;
	let trunkLight = TREE_PALETTE.trunk.light;
	let trunkDark = TREE_PALETTE.trunk.dark;
	const foliageData = TREE_PALETTE.foliage[season];
	let foliage = foliageData.colors;
	let highlight = foliageData.highlight;
	let shadow = foliageData.shadow;

	if (night) {
		trunk = TREE_PALETTE.trunk.night;
		trunkLight = darkenColor(TREE_PALETTE.trunk.light, 0.4);
		trunkDark = darkenColor(TREE_PALETTE.trunk.dark, 0.4);
		foliage = foliage.map((color) => darkenColor(color, 0.4));
		highlight = darkenColor(highlight, 0.4);
		shadow = darkenColor(shadow, 0.4);
	}

	return { trunk, trunkLight, trunkDark, foliage, highlight, shadow };
}

// ============================================================================
// COULEURS DE LA RIVIÈRE
// ============================================================================

export const RIVER_PALETTE = {
	// Eau par saison
	water: {
		spring: {
			base: rgb(100, 180, 220), // Bleu clair printanier
			light: rgb(140, 200, 235), // Reflets
			dark: rgb(60, 140, 180), // Profondeur
			foam: rgb(220, 240, 255), // Écume
		},
		summer: {
			base: rgb(70, 150, 200), // Bleu vif
			light: rgb(110, 180, 220), // Reflets
			dark: rgb(40, 110, 160), // Profondeur
			foam: rgb(200, 230, 255),
		},
		autumn: {
			base: rgb(80, 130, 160), // Bleu-gris
			light: rgb(110, 160, 190), // Reflets ternes
			dark: rgb(50, 90, 120), // Profondeur
			foam: rgb(180, 200, 220),
		},
		winter: {
			base: rgb(150, 180, 200), // Bleu glacé
			light: rgb(180, 210, 230), // Reflets glacés
			dark: rgb(100, 140, 170), // Profondeur froide
			foam: rgb(230, 245, 255),
		},
	},
	// Glace (hiver froid)
	ice: {
		base: rgb(200, 220, 240), // Glace
		light: rgb(230, 245, 255), // Reflet
		crack: rgb(150, 180, 210), // Fissures
	},
	// Berges
	bank: {
		mud: rgb(90, 70, 50), // Boue
		rocks: rgb(130, 125, 120), // Rochers
		rocksLight: rgb(160, 155, 150),
		rocksDark: rgb(100, 95, 90),
	},
};

/* Retourne les couleurs de la rivière selon les conditions */
export function getRiverColors(conditions: WorldConditions) {
	const { season, temperature } = conditions;
	const night = isNight(conditions);

	// Rivière gelée si température très froide (indépendamment de la saison)
	const isFrozen = temperature < -5;

	let water = RIVER_PALETTE.water[season];
	const bank = RIVER_PALETTE.bank;

	if (night) {
		water = {
			base: darkenColor(water.base, 0.5),
			light: darkenColor(water.light, 0.5),
			dark: darkenColor(water.dark, 0.5),
			foam: darkenColor(water.foam, 0.6),
		};
	}

	return {
		isFrozen,
		water,
		ice: RIVER_PALETTE.ice,
		bank: {
			mud: night ? darkenColor(bank.mud, 0.4) : bank.mud,
			rocks: night ? darkenColor(bank.rocks, 0.4) : bank.rocks,
			rocksLight: night ? darkenColor(bank.rocksLight, 0.4) : bank.rocksLight,
			rocksDark: night ? darkenColor(bank.rocksDark, 0.4) : bank.rocksDark,
		},
	};
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
		day: {
			base: rgb(255, 255, 255), // Blanc
			light: rgb(255, 255, 255), // Blanc pur
			shadow: rgb(220, 225, 235), // Ombre légère
			deep: rgb(190, 200, 215), // Ombre profonde
		},
		golden: {
			base: rgb(255, 220, 180), // Doré
			light: rgb(255, 240, 210), // Doré clair
			shadow: rgb(255, 180, 130), // Orange
			deep: rgb(240, 150, 100), // Orange foncé
		},
		night: {
			base: rgb(60, 60, 80), // Gris bleuté
			light: rgb(80, 80, 100), // Gris clair
			shadow: rgb(40, 40, 60), // Gris foncé
			deep: rgb(25, 25, 45), // Très foncé
		},
		rain: {
			base: rgb(140, 145, 155), // Gris pluie
			light: rgb(160, 165, 175), // Gris clair
			shadow: rgb(110, 115, 125), // Gris foncé
			deep: rgb(85, 90, 100), // Très foncé
		},
		storm: {
			base: rgb(80, 80, 90), // Gris orageux
			light: rgb(100, 100, 110), // Gris moyen
			shadow: rgb(55, 55, 65), // Gris foncé
			deep: rgb(35, 35, 45), // Presque noir
		},
	},
};

/* Retourne la couleur du soleil selon les conditions */
export function getSunColor(conditions: WorldConditions): Color {
	const { timeOfDay } = conditions;

	if (timeOfDay === "dawn") return CELESTIAL_PALETTE.sun.dawn;
	if (timeOfDay === "dusk") return CELESTIAL_PALETTE.sun.dusk;

	return CELESTIAL_PALETTE.sun.day;
}

/* Retourne la palette des nuages selon les conditions */
export function getCloudPalette(conditions: WorldConditions): {
	base: Color;
	light: Color;
	shadow: Color;
	deep: Color;
} {
	const { weather } = conditions;

	if (isNight(conditions)) return CELESTIAL_PALETTE.clouds.night;
	if (isGoldenHour(conditions)) return CELESTIAL_PALETTE.clouds.golden;
	if (weather === "storm") return CELESTIAL_PALETTE.clouds.storm;
	if (weather === "rain" || weather === "cloudy")
		return CELESTIAL_PALETTE.clouds.rain;

	return CELESTIAL_PALETTE.clouds.day;
}

/* Retourne la couleur des nuages (rétrocompatibilité) */
export function getCloudColor(conditions: WorldConditions): Color {
	return getCloudPalette(conditions).base;
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
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Interpole simplement entre deux couleurs
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
 */
export function darkenColor(color: Color, factor: number): Color {
	return {
		r: Math.round(color.r * factor),
		g: Math.round(color.g * factor),
		b: Math.round(color.b * factor),
	};
}

/**
 * Éclaircit une couleur
 */
export function lightenColor(color: Color, factor: number): Color {
	return {
		r: Math.min(255, Math.round(color.r + (255 - color.r) * factor)),
		g: Math.min(255, Math.round(color.g + (255 - color.g) * factor)),
		b: Math.min(255, Math.round(color.b + (255 - color.b) * factor)),
	};
}

/**
 * Mélange deux couleurs
 */
export function blendColors(color1: Color, color2: Color, ratio: number): Color {
	return lerpColorSimple(color1, color2, ratio);
}
