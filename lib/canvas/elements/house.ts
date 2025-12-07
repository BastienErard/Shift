import type { Element } from "../types";
import type { WorldConditions } from "../conditions";
import { rectangle } from "../types";
import { getHouseColors, SNOW_PALETTE } from "../palette";
import { CANVAS_WIDTH, HORIZON_Y } from "../types";
import { calculateWindOffset } from "../utils/wind";
import { hasSnowOnGround, isNight } from "../conditions";

/**
 * Crée les éléments de la maison cottage rustique
 */
export function createHouse(conditions: WorldConditions): Element[] {
	const colors = getHouseColors(conditions);
	const isSnowy = hasSnowOnGround(conditions);
	const night = isNight(conditions);

	/* Position de base de la maison */
	const baseX = Math.floor(CANVAS_WIDTH * 0.42);
	const baseY = HORIZON_Y + 70;

	/* Dimensions de la maison cottage */
	const dimensions = {
		wall: { width: 140, height: 90 },
		roof: { width: 170, height: 35 },
		roofTop: { width: 60, height: 20 },
		door: { width: 28, height: 55 },
		window: { width: 26, height: 26 },
		chimney: { width: 24, height: 45 },
		planter: { width: 30, height: 12 },
	};

	const elements: Element[] = [];

	// ========================================
	// CHEMINÉE (derrière le toit)
	// ========================================

	const chimneyX = baseX + dimensions.wall.width - 45;
	const chimneyY = baseY - dimensions.roof.height - dimensions.roofTop.height - 30;

	// Corps de la cheminée
	elements.push(
		rectangle(chimneyX, chimneyY, dimensions.chimney.width, dimensions.chimney.height, colors.chimney)
	);

	// Détail sombre (côté)
	elements.push(
		rectangle(
			chimneyX + dimensions.chimney.width - 6,
			chimneyY,
			6,
			dimensions.chimney.height,
			colors.chimneyDark
		)
	);

	// Rebord de cheminée
	elements.push(
		rectangle(chimneyX - 3, chimneyY - 4, dimensions.chimney.width + 6, 6, colors.chimneyDark)
	);

	// Neige sur la cheminée
	if (isSnowy) {
		elements.push(
			rectangle(chimneyX - 2, chimneyY - 8, dimensions.chimney.width + 4, 6, SNOW_PALETTE.base)
		);
	}

	// ========================================
	// TOIT EN CHAUME/TUILES DÉTAILLÉ
	// ========================================

	const roofY = baseY - dimensions.roof.height;
	const roofX = baseX - 15;

	// Faîtage (sommet du toit)
	const roofTopX = baseX + (dimensions.wall.width - dimensions.roofTop.width) / 2;
	const roofTopY = roofY - dimensions.roofTop.height;

	// Ombre sous le faîtage
	elements.push(
		rectangle(roofTopX - 5, roofTopY + dimensions.roofTop.height - 5, dimensions.roofTop.width + 10, 8, colors.roofDark)
	);

	// Faîtage
	elements.push(rectangle(roofTopX, roofTopY, dimensions.roofTop.width, dimensions.roofTop.height, colors.roofTop));

	// Partie principale du toit - avec texture
	// Base du toit (ombre)
	elements.push(
		rectangle(roofX, roofY + dimensions.roof.height - 10, dimensions.roof.width, 12, colors.roofDark)
	);

	// Corps du toit
	elements.push(rectangle(roofX, roofY, dimensions.roof.width, dimensions.roof.height, colors.roof));

	// Texture du toit (lignes horizontales pour simuler tuiles/chaume)
	const roofLines = [0.25, 0.5, 0.75];
	for (const ratio of roofLines) {
		elements.push(
			rectangle(roofX + 5, roofY + dimensions.roof.height * ratio, dimensions.roof.width - 10, 3, colors.roofDark)
		);
	}

	// Reflets sur le toit
	elements.push(
		rectangle(roofX + 10, roofY + 5, dimensions.roof.width * 0.4, 6, colors.roofLight)
	);

	// Neige sur le toit
	if (isSnowy) {
		elements.push(
			rectangle(roofX + 5, roofY - 6, dimensions.roof.width - 10, 10, SNOW_PALETTE.base)
		);
		elements.push(
			rectangle(roofTopX + 5, roofTopY - 5, dimensions.roofTop.width - 10, 8, SNOW_PALETTE.base)
		);
	}

	// ========================================
	// MURS EN PIERRE AVEC TEXTURE
	// ========================================

	// Ombre du mur (côté droit)
	elements.push(
		rectangle(
			baseX + dimensions.wall.width - 15,
			baseY,
			15,
			dimensions.wall.height,
			colors.wallDark
		)
	);

	// Corps du mur
	elements.push(rectangle(baseX, baseY, dimensions.wall.width - 10, dimensions.wall.height, colors.wall));

	// Reflet du mur (côté gauche)
	elements.push(rectangle(baseX, baseY, 12, dimensions.wall.height, colors.wallLight));

	// Texture de pierre (lignes horizontales)
	const stoneLines = [0.2, 0.4, 0.6, 0.8];
	for (const ratio of stoneLines) {
		// Ligne horizontale
		elements.push(
			rectangle(baseX + 5, baseY + dimensions.wall.height * ratio, dimensions.wall.width - 20, 2, colors.wallDark)
		);
	}

	// Pierres individuelles (détails)
	const stones = [
		{ x: 10, y: 10, w: 20, h: 12 },
		{ x: 35, y: 8, w: 18, h: 10 },
		{ x: 60, y: 12, w: 22, h: 11 },
		{ x: 90, y: 9, w: 19, h: 10 },
		{ x: 15, y: 30, w: 16, h: 10 },
		{ x: 45, y: 32, w: 20, h: 12 },
		{ x: 75, y: 28, w: 18, h: 11 },
	];

	for (const stone of stones) {
		elements.push(
			rectangle(baseX + stone.x, baseY + stone.y, stone.w, stone.h, colors.wallLight)
		);
	}

	// ========================================
	// POUTRE EN BOIS (sous le toit)
	// ========================================

	elements.push(
		rectangle(baseX - 5, baseY - 8, dimensions.wall.width + 10, 10, colors.wood)
	);
	elements.push(
		rectangle(baseX - 5, baseY - 8, dimensions.wall.width + 10, 3, colors.woodLight)
	);

	// ========================================
	// FENÊTRE GAUCHE AVEC VOLETS
	// ========================================

	const window1X = baseX + 18;
	const windowY = baseY + 25;

	// Volet gauche
	elements.push(
		rectangle(window1X - 10, windowY - 2, 10, dimensions.window.height + 4, colors.wood)
	);
	elements.push(
		rectangle(window1X - 10, windowY - 2, 3, dimensions.window.height + 4, colors.woodLight)
	);

	// Volet droit
	elements.push(
		rectangle(window1X + dimensions.window.width, windowY - 2, 10, dimensions.window.height + 4, colors.wood)
	);
	elements.push(
		rectangle(window1X + dimensions.window.width + 7, windowY - 2, 3, dimensions.window.height + 4, colors.woodDark)
	);

	// Cadre de fenêtre
	elements.push(
		rectangle(window1X - 3, windowY - 3, dimensions.window.width + 6, dimensions.window.height + 6, colors.windowFrame)
	);

	// Vitre
	elements.push(rectangle(window1X, windowY, dimensions.window.width, dimensions.window.height, colors.window));

	// Croisillons
	elements.push(
		rectangle(window1X, windowY + dimensions.window.height / 2 - 1, dimensions.window.width, 3, colors.windowFrame)
	);
	elements.push(
		rectangle(window1X + dimensions.window.width / 2 - 1, windowY, 3, dimensions.window.height, colors.windowFrame)
	);

	// Lumière chaude la nuit (halo)
	if (night) {
		elements.push(
			rectangle(window1X - 8, windowY - 8, dimensions.window.width + 16, dimensions.window.height + 16, { r: 255, g: 220, b: 150 })
		);
		elements.push(rectangle(window1X, windowY, dimensions.window.width, dimensions.window.height, colors.window));
		elements.push(
			rectangle(window1X, windowY + dimensions.window.height / 2 - 1, dimensions.window.width, 3, colors.windowFrame)
		);
		elements.push(
			rectangle(window1X + dimensions.window.width / 2 - 1, windowY, 3, dimensions.window.height, colors.windowFrame)
		);
	}

	// ========================================
	// PORTE AVEC DÉTAILS
	// ========================================

	const doorX = baseX + dimensions.wall.width - dimensions.door.width - 25;
	const doorY = baseY + dimensions.wall.height - dimensions.door.height;

	// Encadrement de porte
	elements.push(
		rectangle(doorX - 5, doorY - 5, dimensions.door.width + 10, dimensions.door.height + 5, colors.woodDark)
	);

	// Porte principale
	elements.push(rectangle(doorX, doorY, dimensions.door.width, dimensions.door.height, colors.door));

	// Reflet sur la porte
	elements.push(rectangle(doorX, doorY, 6, dimensions.door.height, colors.doorLight));

	// Panneau décoratif sur la porte
	elements.push(
		rectangle(doorX + 5, doorY + 8, dimensions.door.width - 10, 18, colors.woodDark)
	);
	elements.push(
		rectangle(doorX + 5, doorY + 32, dimensions.door.width - 10, 18, colors.woodDark)
	);

	// Poignée de porte
	elements.push(
		rectangle(doorX + dimensions.door.width - 9, doorY + dimensions.door.height / 2 - 3, 5, 6, { r: 180, g: 160, b: 100 })
	);

	// ========================================
	// JARDINIÈRE SOUS LA FENÊTRE
	// ========================================

	const planterX = window1X - 5;
	const planterY = windowY + dimensions.window.height + 5;

	// Bac de la jardinière
	elements.push(rectangle(planterX, planterY, dimensions.planter.width + 10, dimensions.planter.height, colors.planter));

	// Terre
	elements.push(
		rectangle(planterX + 2, planterY + 2, dimensions.planter.width + 6, 4, { r: 80, g: 60, b: 40 })
	);

	// Fleurs (sauf en hiver)
	if (conditions.season !== "winter") {
		// Tiges
		elements.push(rectangle(planterX + 8, planterY - 10, 2, 12, colors.flowerLeaf));
		elements.push(rectangle(planterX + 18, planterY - 14, 2, 16, colors.flowerLeaf));
		elements.push(rectangle(planterX + 28, planterY - 8, 2, 10, colors.flowerLeaf));

		// Fleurs
		elements.push(rectangle(planterX + 5, planterY - 16, 8, 8, colors.flower));
		elements.push(rectangle(planterX + 15, planterY - 20, 8, 8, colors.flower));
		elements.push(rectangle(planterX + 25, planterY - 14, 8, 8, colors.flower));
	} else if (isSnowy) {
		// Neige dans la jardinière
		elements.push(rectangle(planterX + 2, planterY - 3, dimensions.planter.width + 6, 5, SNOW_PALETTE.base));
	}

	// ========================================
	// MARCHE DEVANT LA PORTE
	// ========================================

	elements.push(
		rectangle(doorX - 8, baseY + dimensions.wall.height, dimensions.door.width + 16, 8, colors.wallDark)
	);

	if (isSnowy) {
		elements.push(
			rectangle(doorX - 6, baseY + dimensions.wall.height - 3, dimensions.door.width + 12, 4, SNOW_PALETTE.base)
		);
	}

	return elements;
}

/**
 * Crée la fumée de la cheminée
 */
export function createChimneySmoke(conditions: WorldConditions, offset: number = 0): Element[] {
	// Fumée visible quand il fait froid (< 15°C)
	if (conditions.temperature >= 15) {
		return [];
	}

	const elements: Element[] = [];

	// Position alignée avec la cheminée de createHouse
	const baseX = Math.floor(CANVAS_WIDTH * 0.42);
	const chimneyX = baseX + 140 - 45 + 10; // Centre de la cheminée
	const chimneyTopY = HORIZON_Y + 70 - 35 - 20 - 30; // Haut de la cheminée

	const smokeOpacity = conditions.temperature < 5 ? 180 : 140;
	const smokeColor = { r: smokeOpacity, g: smokeOpacity, b: smokeOpacity };

	// Hauteur du cycle d'animation (les particules montent puis se recyclent)
	const cycleHeight = 100;

	// Particules de fumée avec espacement régulier
	const numParticles = 8;

	for (let i = 0; i < numParticles; i++) {
		// Position de base de chaque particule (espacées régulièrement)
		const baseY = -10 - (i * cycleHeight) / numParticles;

		// Animation : chaque particule monte avec l'offset
		// On utilise modulo pour créer un cycle continu
		const animatedY = baseY - (offset % cycleHeight);

		// La particule se recycle quand elle atteint le haut
		const cycleY = animatedY < -cycleHeight ? animatedY + cycleHeight : animatedY;

		// Distance depuis le haut de la cheminée (pour l'opacité)
		const distanceFromBase = Math.abs(cycleY);

		// Opacité : pleine près de la cheminée, disparaît en montant
		const opacity = Math.max(0, Math.min(1, 1 - distanceFromBase / cycleHeight));

		// Skip si invisible
		if (opacity < 0.05) continue;

		// Taille croissante avec la hauteur (la fumée s'étale)
		const baseSize = 8;
		const size = baseSize + (distanceFromBase / cycleHeight) * 8;

		// Offset horizontal dû au vent (plus fort en hauteur)
		const heightFactor = distanceFromBase / 20;
		const windOffset = calculateWindOffset(
			conditions.windSpeed,
			conditions.windDirection,
			heightFactor
		);

		// Léger mouvement sinusoïdal horizontal
		const waveX = Math.sin((offset + i * 20) * 0.05) * 3;

		// Couleur avec fondu vers transparent (blanc)
		const particleColor = {
			r: Math.round(smokeColor.r * opacity + 255 * (1 - opacity)),
			g: Math.round(smokeColor.g * opacity + 255 * (1 - opacity)),
			b: Math.round(smokeColor.b * opacity + 255 * (1 - opacity)),
		};

		elements.push(
			rectangle(
				chimneyX + windOffset + waveX,
				chimneyTopY + cycleY,
				size,
				size,
				particleColor
			)
		);
	}

	return elements;
}
