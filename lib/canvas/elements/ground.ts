import type { Element } from "../types";
import type { WorldConditions } from "../conditions";
import { rectangle } from "../types";
import { getGroundPalette, SNOW_PALETTE } from "../palette";
import { CANVAS_WIDTH, CANVAS_HEIGHT, HORIZON_Y } from "../types";
import { hasSnowOnGround } from "../conditions";

/**
 * Crée les éléments de texture du sol
 * Ajoute des variations de couleur et des détails pour plus de profondeur
 */
export function createGroundTexture(conditions: WorldConditions): Element[] {
	const elements: Element[] = [];
	const palette = getGroundPalette(conditions);
	const isSnowy = hasSnowOnGround(conditions);

	const groundStartY = HORIZON_Y;
	const groundHeight = CANVAS_HEIGHT - HORIZON_Y;

	// NOTE: La zone proche de l'horizon (0-15%) est laissée vide pour que
	// la forêt en arrière-plan soit visible. Les arbres de la forêt sont
	// dessinés AVANT cette texture dans le builder.

	// Bandes horizontales pour créer de la profondeur
	// On commence plus bas pour laisser de l'espace à la forêt
	const bands = [
		{ y: groundHeight * 0.12, height: groundHeight * 0.12, color: palette.dark },
		{ y: groundHeight * 0.24, height: groundHeight * 0.18, color: palette.base },
		{ y: groundHeight * 0.42, height: groundHeight * 0.22, color: palette.light },
		{ y: groundHeight * 0.64, height: groundHeight * 0.36, color: palette.base },
	];

	// Dessine les bandes de base
	for (const band of bands) {
		elements.push(
			rectangle(0, groundStartY + band.y, CANVAS_WIDTH, band.height, band.color)
		);
	}

	// Ajoute des touffes d'herbe / texture
	if (!isSnowy) {
		// Petites variations de couleur (herbe)
		const grassPatches = generateGrassPatches(conditions, palette);
		elements.push(...grassPatches);
	} else {
		// Texture neige (ondulations, traces)
		const snowTexture = generateSnowTexture(conditions);
		elements.push(...snowTexture);
	}

	// Petits rochers / cailloux
	const rocks = generateRocks(conditions, palette);
	elements.push(...rocks);

	return elements;
}

/**
 * Génère des touffes d'herbe aléatoires
 */
function generateGrassPatches(
	conditions: WorldConditions,
	palette: { base: any; light: any; dark: any; accent: any }
): Element[] {
	const elements: Element[] = [];
	const groundStartY = HORIZON_Y;

	// Positions prédéfinies pour éviter le calcul aléatoire à chaque frame
	const patchPositions = [
		// Premier plan (plus grand, plus visible)
		{ x: 50, y: 0.7, w: 25, h: 8, color: "accent" },
		{ x: 150, y: 0.75, w: 20, h: 6, color: "light" },
		{ x: 280, y: 0.72, w: 22, h: 7, color: "accent" },
		{ x: 400, y: 0.78, w: 18, h: 5, color: "light" },
		{ x: 520, y: 0.74, w: 24, h: 8, color: "accent" },
		{ x: 650, y: 0.76, w: 20, h: 6, color: "light" },
		{ x: 750, y: 0.73, w: 22, h: 7, color: "accent" },

		// Milieu
		{ x: 30, y: 0.55, w: 15, h: 5, color: "light" },
		{ x: 120, y: 0.5, w: 18, h: 6, color: "base" },
		{ x: 230, y: 0.52, w: 14, h: 4, color: "light" },
		{ x: 350, y: 0.48, w: 16, h: 5, color: "base" },
		{ x: 470, y: 0.54, w: 12, h: 4, color: "light" },
		{ x: 580, y: 0.5, w: 17, h: 5, color: "base" },
		{ x: 700, y: 0.52, w: 14, h: 4, color: "light" },

		// Arrière-plan (plus petit, proche de l'horizon)
		{ x: 80, y: 0.25, w: 10, h: 3, color: "dark" },
		{ x: 180, y: 0.2, w: 12, h: 4, color: "base" },
		{ x: 300, y: 0.22, w: 8, h: 3, color: "dark" },
		{ x: 420, y: 0.18, w: 11, h: 3, color: "base" },
		{ x: 550, y: 0.24, w: 9, h: 3, color: "dark" },
		{ x: 680, y: 0.2, w: 10, h: 3, color: "base" },
	];

	const groundHeight = CANVAS_HEIGHT - HORIZON_Y;

	for (const patch of patchPositions) {
		const colorKey = patch.color as keyof typeof palette;
		elements.push(
			rectangle(
				patch.x,
				groundStartY + groundHeight * patch.y,
				patch.w,
				patch.h,
				palette[colorKey]
			)
		);
	}

	return elements;
}

/**
 * Génère la texture de neige
 */
function generateSnowTexture(conditions: WorldConditions): Element[] {
	const elements: Element[] = [];
	const groundStartY = HORIZON_Y;
	const groundHeight = CANVAS_HEIGHT - HORIZON_Y;

	// Ondulations de neige (ombres légères)
	const snowDrifts = [
		{ x: 0, y: 0.3, w: 120, h: 15, color: SNOW_PALETTE.shadow },
		{ x: 200, y: 0.4, w: 150, h: 12, color: SNOW_PALETTE.shadow },
		{ x: 450, y: 0.35, w: 130, h: 14, color: SNOW_PALETTE.shadow },
		{ x: 680, y: 0.38, w: 120, h: 10, color: SNOW_PALETTE.shadow },

		// Reflets brillants
		{ x: 80, y: 0.5, w: 60, h: 8, color: SNOW_PALETTE.light },
		{ x: 300, y: 0.55, w: 80, h: 10, color: SNOW_PALETTE.light },
		{ x: 550, y: 0.52, w: 70, h: 9, color: SNOW_PALETTE.light },
		{ x: 720, y: 0.6, w: 50, h: 7, color: SNOW_PALETTE.light },

		// Accents (neige fraîche)
		{ x: 150, y: 0.7, w: 40, h: 6, color: SNOW_PALETTE.accent },
		{ x: 380, y: 0.75, w: 50, h: 8, color: SNOW_PALETTE.accent },
		{ x: 600, y: 0.72, w: 45, h: 7, color: SNOW_PALETTE.accent },
	];

	for (const drift of snowDrifts) {
		elements.push(
			rectangle(
				drift.x,
				groundStartY + groundHeight * drift.y,
				drift.w,
				drift.h,
				drift.color
			)
		);
	}

	return elements;
}

/**
 * Génère des petits rochers / cailloux
 */
function generateRocks(
	conditions: WorldConditions,
	palette: { base: any; light: any; dark: any; accent: any }
): Element[] {
	const elements: Element[] = [];
	const groundStartY = HORIZON_Y;
	const groundHeight = CANVAS_HEIGHT - HORIZON_Y;

	const isSnowy = hasSnowOnGround(conditions);

	// Couleurs des rochers
	const rockColor = isSnowy
		? { r: 100, g: 100, b: 105 }
		: { r: 120, g: 115, b: 110 };
	const rockHighlight = isSnowy
		? { r: 140, g: 140, b: 145 }
		: { r: 150, g: 145, b: 140 };

	// Positions des rochers
	const rockPositions = [
		// Gros rochers au premier plan
		{ x: 100, y: 0.8, w: 18, h: 12 },
		{ x: 350, y: 0.85, w: 22, h: 14 },
		{ x: 620, y: 0.82, w: 16, h: 10 },

		// Petits cailloux
		{ x: 180, y: 0.65, w: 8, h: 5 },
		{ x: 450, y: 0.6, w: 10, h: 6 },
		{ x: 720, y: 0.68, w: 7, h: 4 },

		// Très petits (détails)
		{ x: 250, y: 0.45, w: 5, h: 3 },
		{ x: 500, y: 0.4, w: 6, h: 4 },
	];

	for (const rock of rockPositions) {
		// Ombre du rocher
		elements.push(
			rectangle(
				rock.x + 2,
				groundStartY + groundHeight * rock.y + 2,
				rock.w,
				rock.h,
				palette.dark
			)
		);

		// Corps du rocher
		elements.push(
			rectangle(
				rock.x,
				groundStartY + groundHeight * rock.y,
				rock.w,
				rock.h,
				rockColor
			)
		);

		// Reflet (seulement pour les gros)
		if (rock.w > 12) {
			elements.push(
				rectangle(
					rock.x + 2,
					groundStartY + groundHeight * rock.y + 2,
					rock.w * 0.4,
					rock.h * 0.4,
					rockHighlight
				)
			);
		}
	}

	return elements;
}

/**
 * Crée un chemin de terre
 */
export function createPath(conditions: WorldConditions): Element[] {
	const elements: Element[] = [];
	const isSnowy = hasSnowOnGround(conditions);

	const pathColor = isSnowy
		? { r: 180, g: 175, b: 170 } // Chemin enneigé
		: { r: 140, g: 110, b: 80 }; // Terre
	const pathEdge = isSnowy
		? { r: 160, g: 155, b: 150 }
		: { r: 120, g: 90, b: 60 };

	// Chemin qui mène à la maison
	const pathY = HORIZON_Y + 120;

	// Bords du chemin
	elements.push(rectangle(280, pathY, 180, 50, pathEdge));

	// Centre du chemin
	elements.push(rectangle(290, pathY + 5, 160, 40, pathColor));

	return elements;
}
