import type { Element } from "../types";
import type { WorldConditions } from "../conditions";
import { rectangle } from "../types";
import { getHouseColors } from "../palette";
import { CANVAS_WIDTH, HORIZON_Y } from "../types";
import { calculateWindOffset } from "../utils/wind";

/* Crée les éléments de la maison */
export function createHouse(conditions: WorldConditions): Element[] {
	// Récupère les couleurs adaptées aux conditions
	const colors = getHouseColors(conditions);

	/* Position de base de la maison */
	const baseX = Math.floor(CANVAS_WIDTH * 0.4); // 40% depuis la gauche
	const baseY = HORIZON_Y + 60; // Légèrement en dessous de l'horizon

	/* Dimensions de la maison */
	const dimensions = {
		wall: { width: 120, height: 80 },
		roof: { width: 140, height: 25 },
		roofTop: { width: 40, height: 15 },
		door: { width: 25, height: 50 },
		window: { width: 22, height: 22 },
		chimney: { width: 20, height: 35 },
	};

	const elements: Element[] = [];

	// ========================================
	// CHEMINÉE (derrière le toit)
	// ========================================

	/* 🎓 La cheminée est dessinée EN PREMIER */
	const chimneyX = baseX + dimensions.wall.width - 35;
	const chimneyY = baseY - dimensions.roof.height - dimensions.roofTop.height - 20;

	elements.push(
		rectangle(
			chimneyX,
			chimneyY,
			dimensions.chimney.width,
			dimensions.chimney.height,
			colors.chimney
		)
	);

	// ========================================
	// TOIT
	// ========================================

	/* Le toit est composé de 3 rectangles */

	// Faîtage (sommet du toit)
	const roofTopX = baseX + (dimensions.wall.width - dimensions.roofTop.width) / 2;
	const roofTopY = baseY - dimensions.roof.height - dimensions.roofTop.height;

	elements.push(
		rectangle(
			roofTopX,
			roofTopY,
			dimensions.roofTop.width,
			dimensions.roofTop.height,
			colors.roofTop
		)
	);

	// Partie gauche du toit
	const roofY = baseY - dimensions.roof.height;
	const roofLeftX = baseX - 10; // Déborde un peu du mur

	elements.push(
		rectangle(roofLeftX, roofY, dimensions.roof.width / 2, dimensions.roof.height, colors.roof)
	);

	// Partie droite du toit
	const roofRightX = baseX + dimensions.wall.width / 2;

	elements.push(
		rectangle(roofRightX, roofY, dimensions.roof.width / 2, dimensions.roof.height, colors.roof)
	);

	// ========================================
	// MURS
	// ========================================

	elements.push(
		rectangle(baseX, baseY, dimensions.wall.width, dimensions.wall.height, colors.wall)
	);

	// ========================================
	// FENÊTRE
	// ========================================

	/* La fenêtre change de couleur */
	const windowX = baseX + 25;
	const windowY = baseY + 20;

	elements.push(
		rectangle(windowX, windowY, dimensions.window.width, dimensions.window.height, colors.window)
	);

	// Croisillons de la fenêtre (style cottage)
	const windowFrameColor = colors.wall; // Même couleur que le mur

	// Barre horizontale
	elements.push(
		rectangle(
			windowX,
			windowY + dimensions.window.height / 2 - 1,
			dimensions.window.width,
			3,
			windowFrameColor
		)
	);

	// Barre verticale
	elements.push(
		rectangle(
			windowX + dimensions.window.width / 2 - 1,
			windowY,
			3,
			dimensions.window.height,
			windowFrameColor
		)
	);

	// ========================================
	// PORTE
	// ========================================

	const doorX = baseX + dimensions.wall.width - dimensions.door.width - 20;
	const doorY = baseY + dimensions.wall.height - dimensions.door.height;

	elements.push(
		rectangle(doorX, doorY, dimensions.door.width, dimensions.door.height, colors.door)
	);

	// Poignée de porte (petit carré)
	elements.push(
		rectangle(
			doorX + dimensions.door.width - 8,
			doorY + dimensions.door.height / 2 - 2,
			4,
			4,
			colors.window // Couleur métallique (réutilise la couleur fenêtre)
		)
	);

	return elements;
}

/* Crée la fumée de la cheminée */
export function createChimneySmoke(conditions: WorldConditions, offset: number = 0): Element[] {
	if (conditions.temperature >= 15) {
		return [];
	}

	const elements: Element[] = [];

	const baseX = Math.floor(CANVAS_WIDTH * 0.4);
	const chimneyX = baseX + 120 - 35 + 5;
	const chimneyTopY = HORIZON_Y + 60 - 25 - 15 - 20 - 35;

	const smokeOpacity = conditions.temperature < 5 ? 180 : 140;
	const smokeColor = { r: smokeOpacity, g: smokeOpacity, b: smokeOpacity };

	const baseParticles = [
		{ x: 0, baseY: -10, size: 8 },
		{ x: 3, baseY: -22, size: 10 },
		{ x: -2, baseY: -36, size: 12 },
		{ x: 4, baseY: -52, size: 10 },
		{ x: -1, baseY: -68, size: 8 },
	];

	for (let i = 0; i < baseParticles.length; i++) {
		const particle = baseParticles[i];

		const animatedY = particle.baseY - offset;
		const cycleY = animatedY < -100 ? animatedY + 100 : animatedY;

		const distanceFromTop = Math.abs(cycleY);
		const opacity = Math.max(0, Math.min(1, 1 - distanceFromTop / 80));

		// 🆕 Calcule le décalage horizontal causé par le vent
		// Plus la fumée est haute, plus elle est affectée
		const heightFactor = distanceFromTop / 20;
		const windOffset = calculateWindOffset(
			conditions.windSpeed,
			conditions.windDirection,
			heightFactor
		);

		const particleColor = {
			r: Math.round(smokeColor.r * opacity + 255 * (1 - opacity)),
			g: Math.round(smokeColor.g * opacity + 255 * (1 - opacity)),
			b: Math.round(smokeColor.b * opacity + 255 * (1 - opacity)),
		};

		if (opacity > 0.1) {
			elements.push(
				rectangle(
					chimneyX + particle.x + windOffset, // 🆕 Ajoute l'offset du vent
					chimneyTopY + cycleY,
					particle.size,
					particle.size,
					particleColor
				)
			);
		}
	}

	return elements;
}
