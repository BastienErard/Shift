import type { Element } from "../types";
import type { WorldConditions } from "../conditions";
import { rectangle } from "../types";
import { getTreeColors } from "../palette";
import { CANVAS_WIDTH, HORIZON_Y } from "../types";

/* Crée les éléments d'un arbre */
export function createTree(conditions: WorldConditions, positionX?: number): Element[] {
	const colors = getTreeColors(conditions);
	const elements: Element[] = [];

	/* Position de base de l'arbre */
	const baseX = positionX ?? Math.floor(CANVAS_WIDTH * 0.2);
	const baseY = HORIZON_Y + 80; // Pied du tronc sur le sol

	/* Dimensions de l'arbre */
	const dimensions = {
		trunk: { width: 16, height: 70 },
		foliage: {
			top: { width: 30, height: 20 },
			middle: { width: 50, height: 25 },
			bottom: { width: 70, height: 30 },
		},
	};

	// ========================================
	// TRONC
	// ========================================

	const trunkX = baseX - dimensions.trunk.width / 2;
	const trunkY = baseY - dimensions.trunk.height;

	elements.push(
		rectangle(trunkX, trunkY, dimensions.trunk.width, dimensions.trunk.height, colors.trunk)
	);

	// ========================================
	// FEUILLAGE
	// ========================================

	/* 3 couches de feuillage, du bas vers le haut */

	// Couche basse (la plus large)
	const bottomY = trunkY - dimensions.foliage.bottom.height + 15;
	const bottomX = baseX - dimensions.foliage.bottom.width / 2;

	elements.push(
		rectangle(
			bottomX,
			bottomY,
			dimensions.foliage.bottom.width,
			dimensions.foliage.bottom.height,
			colors.foliage[0]
		)
	);

	// Couche milieu
	const middleY = bottomY - dimensions.foliage.middle.height + 10;
	const middleX = baseX - dimensions.foliage.middle.width / 2;

	elements.push(
		rectangle(
			middleX,
			middleY,
			dimensions.foliage.middle.width,
			dimensions.foliage.middle.height,
			colors.foliage[1]
		)
	);

	// Couche haute (sommet)
	const topY = middleY - dimensions.foliage.top.height + 8;
	const topX = baseX - dimensions.foliage.top.width / 2;

	elements.push(
		rectangle(
			topX,
			topY,
			dimensions.foliage.top.width,
			dimensions.foliage.top.height,
			colors.foliage[2]
		)
	);

	return elements;
}

/* Crée plusieurs arbres à différentes positions */
export function createTrees(conditions: WorldConditions, positions: number[]): Element[] {
	const elements: Element[] = [];

	for (const posX of positions) {
		elements.push(...createTree(conditions, posX));
	}

	return elements;
}

/* Crée un petit buisson */
export function createBush(
	conditions: WorldConditions,
	positionX: number,
	positionY?: number
): Element[] {
	const colors = getTreeColors(conditions);
	const elements: Element[] = [];

	const baseX = positionX;
	const baseY = positionY ?? HORIZON_Y + 95;

	/* Le buisson est fait de 3 rectangles qui se chevauchent */
	const bushColor = colors.foliage[0];

	// Rectangle central (le plus grand)
	elements.push(rectangle(baseX - 20, baseY - 18, 40, 22, bushColor));

	// Rectangle gauche
	elements.push(rectangle(baseX - 28, baseY - 12, 20, 16, colors.foliage[1]));

	// Rectangle droit
	elements.push(rectangle(baseX + 10, baseY - 14, 22, 18, colors.foliage[2]));

	return elements;
}
