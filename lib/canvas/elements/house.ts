import type { Element } from "../types";
import type { WorldConditions } from "../conditions";
import { rectangle } from "../types";
import { getHouseColors } from "../palette";
import { CANVAS_WIDTH, HORIZON_Y } from "../types";

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
export function createChimneySmoke(conditions: WorldConditions): Element[] {
	// Pas de fumée si température >= 15°C
	if (conditions.temperature >= 15) {
		return [];
	}

	const elements: Element[] = [];

	/* Position de base (au-dessus de la cheminée */
	const baseX = Math.floor(CANVAS_WIDTH * 0.4);
	const chimneyX = baseX + 120 - 35 + 5; // Centre de la cheminée
	const chimneyTopY = HORIZON_Y + 60 - 25 - 15 - 20 - 35; // Haut de la cheminée

	/* Couleur de la fumée */
	const smokeOpacity = conditions.temperature < 5 ? 180 : 140;
	const smokeColor = { r: smokeOpacity, g: smokeOpacity, b: smokeOpacity };

	/* Particules de fumée (rectangles qui montent) */
	const particlePositions = [
		{ x: 0, y: -10, size: 8 },
		{ x: 3, y: -22, size: 10 },
		{ x: -2, y: -36, size: 12 },
		{ x: 4, y: -52, size: 10 },
		{ x: -1, y: -68, size: 8 },
	];

	for (const particle of particlePositions) {
		elements.push(
			rectangle(
				chimneyX + particle.x,
				chimneyTopY + particle.y,
				particle.size,
				particle.size,
				smokeColor
			)
		);
	}

	return elements;
}
