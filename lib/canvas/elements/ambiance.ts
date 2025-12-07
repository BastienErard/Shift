// lib/canvas/elements/ambiance.ts

import type { Element } from "../types";
import type { WorldConditions } from "../conditions";
import { rectangle, circle, CANVAS_WIDTH, CANVAS_HEIGHT, HORIZON_Y } from "../types";
import { isNight, hasPrecipitation } from "../conditions";

/**
 * Crée des oiseaux volant dans le ciel
 * Plus nombreux au printemps/été, absents la nuit et par mauvais temps
 */
export function createBirds(conditions: WorldConditions, animationOffset: number = 0): Element[] {
	// Pas d'oiseaux la nuit ou par mauvais temps
	if (isNight(conditions) || hasPrecipitation(conditions)) {
		return [];
	}

	const elements: Element[] = [];

	// Nombre d'oiseaux selon la saison
	const birdCounts: Record<string, number> = {
		spring: 5,
		summer: 4,
		autumn: 3,
		winter: 1,
	};

	const birdCount = birdCounts[conditions.season] || 3;

	// Couleur des oiseaux (silhouettes sombres)
	const birdColor = { r: 40, g: 40, b: 50 };

	// Positions de base des oiseaux (réparties dans le ciel)
	const birdSlots = [
		{ baseX: 100, baseY: 60, speed: 1.2, amplitude: 15 },
		{ baseX: 250, baseY: 45, speed: 0.9, amplitude: 20 },
		{ baseX: 400, baseY: 70, speed: 1.0, amplitude: 18 },
		{ baseX: 550, baseY: 55, speed: 1.1, amplitude: 16 },
		{ baseX: 700, baseY: 65, speed: 0.8, amplitude: 22 },
	];

	for (let i = 0; i < Math.min(birdCount, birdSlots.length); i++) {
		const slot = birdSlots[i];

		// Position X avec mouvement horizontal
		const cycleWidth = CANVAS_WIDTH + 100;
		const x = (slot.baseX + animationOffset * slot.speed * 0.3) % cycleWidth - 50;

		// Position Y avec mouvement sinusoïdal (battement d'ailes)
		const waveY = Math.sin(animationOffset * 0.08 + i * 2) * slot.amplitude;
		const y = slot.baseY + waveY;

		// Phase du battement d'ailes
		const wingPhase = Math.sin(animationOffset * 0.3 + i * 3);
		const wingOffset = wingPhase * 3;

		// Corps de l'oiseau (petit rectangle)
		elements.push(rectangle(x, y, 6, 3, birdColor, "sky"));

		// Aile gauche
		elements.push(rectangle(x - 4, y - 2 + wingOffset, 4, 2, birdColor, "sky"));

		// Aile droite
		elements.push(rectangle(x + 6, y - 2 - wingOffset, 4, 2, birdColor, "sky"));
	}

	return elements;
}

// Couleurs des feuilles d'automne (partagées entre les fonctions)
const LEAF_COLORS = [
	{ r: 200, g: 100, b: 30 },  // Orange
	{ r: 180, g: 60, b: 20 },   // Rouge-orange
	{ r: 220, g: 150, b: 50 },  // Jaune-orange
	{ r: 150, g: 80, b: 30 },   // Brun
	{ r: 190, g: 50, b: 30 },   // Rouge
];

// Définition des arbres avec leurs zones de feuilles
const TREE_LEAF_ZONES = {
	// Arbre à gauche de la maison (x=120, scale=1.0)
	left: {
		x: 120,
		foliageWidth: 90,
		foliageTopY: HORIZON_Y + 80 - 80 - 35 + 20,
		trunkBottomY: HORIZON_Y + 80,
	},
	// Arbre derrière la maison (x=520, scale=0.9)
	behind: {
		x: 520,
		foliageWidth: 81,
		foliageTopY: HORIZON_Y + 80 - 72 - 31 + 18,
		trunkBottomY: HORIZON_Y + 80,
	},
	// Arbre premier plan sud (x=680, scale=1.2, baseY = CANVAS_HEIGHT - 28)
	foreground: {
		x: 680,
		foliageWidth: 108,
		foliageTopY: CANVAS_HEIGHT - 28 - 96 - 42 + 24,
		trunkBottomY: CANVAS_HEIGHT - 28,
	},
};

/**
 * Génère les feuilles pour un arbre spécifique
 */
function generateLeavesForTree(
	tree: { x: number; foliageWidth: number; foliageTopY: number; trunkBottomY: number },
	treeIndex: number,
	animationOffset: number,
	leavesCount: number
): Element[] {
	const elements: Element[] = [];
	const fallSpeed = 0.6;

	const minX = tree.x - tree.foliageWidth / 2;
	const maxX = tree.x + tree.foliageWidth / 2;
	const startY = tree.foliageTopY;
	const endY = tree.trunkBottomY;
	const fallDistance = endY - startY;

	for (let i = 0; i < leavesCount; i++) {
		const leafIndex = treeIndex * leavesCount + i;

		const xOffset = ((leafIndex * 37 + leafIndex * leafIndex * 13) % 100) / 100;
		const baseX = minX + xOffset * (maxX - minX);

		const initialOffset = (((leafIndex * 73 + leafIndex * leafIndex * 41) % 1000) / 1000) * fallDistance;

		const speedVariation = 0.7 + ((leafIndex * 19) % 10) / 20;
		const absoluteY = initialOffset + animationOffset * fallSpeed * speedVariation;
		const y = startY + (absoluteY % fallDistance);

		const oscillation = Math.sin(absoluteY * 0.03 + leafIndex * 5) * 12;
		const x = baseX + oscillation;

		const rotationPhase = Math.sin(absoluteY * 0.04 + leafIndex * 2);
		const width = 4 + Math.abs(rotationPhase) * 3;
		const height = 3 + (1 - Math.abs(rotationPhase)) * 2;

		const colorIndex = leafIndex % LEAF_COLORS.length;
		const color = LEAF_COLORS[colorIndex];

		if (y >= startY && y <= endY && x >= minX - 15 && x <= maxX + 15) {
			elements.push(rectangle(x, y, width, height, color));
		}
	}

	return elements;
}

/**
 * Crée des feuilles qui tombent en automne pour les arbres d'arrière-plan
 * (arbre gauche et arbre derrière la maison)
 */
export function createFallingLeaves(conditions: WorldConditions, animationOffset: number = 0): Element[] {
	if (conditions.season !== "autumn" || conditions.weather === "storm") {
		return [];
	}

	const leavesPerTree = conditions.weather === "rain" ? 3 : 5;
	const elements: Element[] = [];

	// Arbre à gauche (index 0)
	elements.push(...generateLeavesForTree(TREE_LEAF_ZONES.left, 0, animationOffset, leavesPerTree));
	// Arbre derrière la maison (index 1)
	elements.push(...generateLeavesForTree(TREE_LEAF_ZONES.behind, 1, animationOffset, leavesPerTree));

	return elements;
}

/**
 * Crée des feuilles qui tombent pour l'arbre au premier plan sud
 * À appeler APRÈS le rendu de cet arbre
 */
export function createForegroundFallingLeaves(conditions: WorldConditions, animationOffset: number = 0): Element[] {
	if (conditions.season !== "autumn" || conditions.weather === "storm") {
		return [];
	}

	const leavesPerTree = conditions.weather === "rain" ? 3 : 5;

	// Arbre premier plan (index 2 pour garder la cohérence des couleurs)
	return generateLeavesForTree(TREE_LEAF_ZONES.foreground, 2, animationOffset, leavesPerTree);
}

/**
 * Crée des lucioles la nuit en été
 */
export function createFireflies(conditions: WorldConditions, animationOffset: number = 0): Element[] {
	// Uniquement la nuit en été (ou fin de printemps)
	if (!isNight(conditions) || (conditions.season !== "summer" && conditions.season !== "spring")) {
		return [];
	}

	// Pas de lucioles par mauvais temps
	if (hasPrecipitation(conditions)) {
		return [];
	}

	const elements: Element[] = [];

	const fireflyCount = conditions.season === "summer" ? 12 : 6;

	// Couleur des lucioles (jaune-vert lumineux)
	const glowColor = { r: 180, g: 255, b: 100 };
	const coreColor = { r: 255, g: 255, b: 200 };

	for (let i = 0; i < fireflyCount; i++) {
		// Position de base (dans la zone du sol, près des arbres et buissons)
		const baseX = ((i * 83 + i * i * 47) % (CANVAS_WIDTH - 100)) + 50;
		const baseY = HORIZON_Y + 30 + ((i * 67 + i * i * 29) % 200);

		// Mouvement lent et erratique
		const moveX = Math.sin(animationOffset * 0.02 + i * 4) * 15;
		const moveY = Math.cos(animationOffset * 0.015 + i * 3) * 10;

		const x = baseX + moveX;
		const y = baseY + moveY;

		// Clignotement (cycle d'environ 3 secondes)
		const blinkCycle = (animationOffset * 0.05 + i * 2.5) % (Math.PI * 2);
		const brightness = Math.max(0, Math.sin(blinkCycle));

		if (brightness > 0.3) {
			// Halo lumineux
			const haloSize = 6 + brightness * 4;
			const haloColor = {
				r: Math.round(glowColor.r * brightness * 0.5),
				g: Math.round(glowColor.g * brightness * 0.5),
				b: Math.round(glowColor.b * brightness * 0.5),
			};
			elements.push(rectangle(x - haloSize / 2, y - haloSize / 2, haloSize, haloSize, haloColor));

			// Cœur brillant
			const coreSize = 2 + brightness * 2;
			elements.push(rectangle(x - coreSize / 2, y - coreSize / 2, coreSize, coreSize, coreColor));
		}
	}

	return elements;
}

/**
 * Crée une brume matinale à l'aube
 */
export function createMorningMist(conditions: WorldConditions): Element[] {
	// Uniquement à l'aube et par temps calme
	if (conditions.timeOfDay !== "dawn" || hasPrecipitation(conditions)) {
		return [];
	}

	const elements: Element[] = [];

	// Couleur de la brume (blanc semi-transparent simulé)
	const mistColors = [
		{ r: 220, g: 225, b: 235 },
		{ r: 210, g: 215, b: 225 },
		{ r: 200, g: 205, b: 215 },
	];

	// Bandes de brume près du sol et de la rivière
	const mistLayers = [
		// Brume basse sur le sol
		{ y: HORIZON_Y + 50, height: 30, colorIndex: 0 },
		{ y: HORIZON_Y + 80, height: 25, colorIndex: 1 },
		// Brume sur la rivière
		{ y: CANVAS_HEIGHT - 110, height: 35, colorIndex: 0 },
		{ y: CANVAS_HEIGHT - 80, height: 25, colorIndex: 2 },
	];

	for (const layer of mistLayers) {
		const color = mistColors[layer.colorIndex];
		// Plusieurs rectangles pour un effet de brume irrégulière
		elements.push(rectangle(0, layer.y, CANVAS_WIDTH * 0.4, layer.height, color));
		elements.push(rectangle(CANVAS_WIDTH * 0.35, layer.y + 5, CANVAS_WIDTH * 0.35, layer.height - 5, color));
		elements.push(rectangle(CANVAS_WIDTH * 0.6, layer.y - 3, CANVAS_WIDTH * 0.4, layer.height + 3, color));
	}

	return elements;
}

/**
 * Crée des fleurs au printemps
 */
export function createSpringFlowers(conditions: WorldConditions): Element[] {
	if (conditions.season !== "spring") {
		return [];
	}

	const elements: Element[] = [];

	// Couleurs des fleurs
	const flowerColors = [
		{ r: 255, g: 150, b: 200 },  // Rose
		{ r: 255, g: 255, b: 150 },  // Jaune
		{ r: 200, g: 150, b: 255 },  // Violet clair
		{ r: 255, g: 200, b: 150 },  // Pêche
		{ r: 255, g: 100, b: 100 },  // Rouge
	];

	const stemColor = { r: 80, g: 140, b: 60 };

	// Positions des fleurs (sur le sol, évitant la maison et la rivière)
	const flowerPositions = [
		// Zone gauche
		{ x: 50, y: HORIZON_Y + 100 },
		{ x: 80, y: HORIZON_Y + 130 },
		{ x: 40, y: HORIZON_Y + 160 },
		{ x: 100, y: HORIZON_Y + 180 },
		// Zone droite (avant la rivière)
		{ x: 600, y: HORIZON_Y + 90 },
		{ x: 650, y: HORIZON_Y + 120 },
		{ x: 580, y: HORIZON_Y + 150 },
		{ x: 700, y: HORIZON_Y + 110 },
		// Zone centrale (évite la maison)
		{ x: 200, y: HORIZON_Y + 200 },
		{ x: 230, y: HORIZON_Y + 230 },
		{ x: 180, y: HORIZON_Y + 250 },
	];

	for (let i = 0; i < flowerPositions.length; i++) {
		const pos = flowerPositions[i];
		const colorIndex = i % flowerColors.length;
		const color = flowerColors[colorIndex];

		// Tige
		elements.push(rectangle(pos.x + 2, pos.y - 8, 2, 10, stemColor));

		// Fleur (petit carré coloré)
		elements.push(rectangle(pos.x, pos.y - 12, 6, 6, color));

		// Cœur de la fleur
		elements.push(rectangle(pos.x + 2, pos.y - 10, 2, 2, { r: 255, g: 220, b: 100 }));
	}

	return elements;
}

/**
 * Crée des glaçons sous le toit en hiver
 */
export function createIcicles(conditions: WorldConditions): Element[] {
	if (conditions.season !== "winter" || conditions.temperature > 0) {
		return [];
	}

	const elements: Element[] = [];

	// Position du toit de la maison
	const baseX = Math.floor(CANVAS_WIDTH * 0.42);
	const roofY = HORIZON_Y + 70 - 35; // Bas du toit
	const roofX = baseX - 15;
	const roofWidth = 170;

	// Couleurs de la glace
	const iceColor = { r: 200, g: 230, b: 255 };
	const iceHighlight = { r: 230, g: 245, b: 255 };

	// Positions des glaçons le long du toit
	const icicleCount = 12;
	const spacing = roofWidth / (icicleCount + 1);

	for (let i = 1; i <= icicleCount; i++) {
		const x = roofX + i * spacing;
		// Longueur variable (plus longs au milieu)
		const distFromCenter = Math.abs(i - icicleCount / 2) / (icicleCount / 2);
		const length = 15 + (1 - distFromCenter) * 10 + (i % 3) * 3;
		const width = 3 + (i % 2);

		// Corps du glaçon
		elements.push(rectangle(x, roofY, width, length, iceColor));

		// Reflet
		elements.push(rectangle(x, roofY, 1, length * 0.7, iceHighlight));
	}

	return elements;
}

/**
 * Crée le reflet du soleil ou de la lune dans la rivière
 */
export function createCelestialReflection(conditions: WorldConditions, animationOffset: number = 0): Element[] {
	const elements: Element[] = [];

	// Position de la rivière
	const riverY = CANVAS_HEIGHT - 90;
	const riverHeight = 50;

	// Pas de reflet si la rivière est gelée
	if (conditions.temperature < -5) {
		return [];
	}

	const night = isNight(conditions);

	// Couleur du reflet selon soleil/lune
	let reflectColor: { r: number; g: number; b: number };
	let reflectX: number;

	if (night) {
		reflectColor = { r: 200, g: 200, b: 180 }; // Reflet lunaire
		reflectX = CANVAS_WIDTH - 120; // Position de la lune
	} else {
		// Position du soleil selon le moment
		const sunPositions: Record<string, number> = {
			dawn: CANVAS_WIDTH * 0.08,
			morning: CANVAS_WIDTH * 0.25,
			noon: CANVAS_WIDTH * 0.5,
			afternoon: CANVAS_WIDTH * 0.75,
			dusk: CANVAS_WIDTH * 0.92,
		};
		reflectX = sunPositions[conditions.timeOfDay] || CANVAS_WIDTH * 0.5;

		// Couleur selon le moment
		if (conditions.timeOfDay === "dawn" || conditions.timeOfDay === "dusk") {
			reflectColor = { r: 255, g: 180, b: 100 }; // Orange
		} else {
			reflectColor = { r: 255, g: 240, b: 150 }; // Jaune doré
		}
	}

	// Traînée de reflet verticale avec ondulation
	const reflectWidth = 20;
	const segments = 8;

	for (let i = 0; i < segments; i++) {
		const segmentY = riverY + 5 + (i * (riverHeight - 15)) / segments;
		const wave = Math.sin(animationOffset * 0.05 + i * 0.8) * 5;
		const segmentX = reflectX - reflectWidth / 2 + wave;

		// Opacité décroissante vers le bas
		const opacity = 1 - (i / segments) * 0.6;
		const segColor = {
			r: Math.round(reflectColor.r * opacity),
			g: Math.round(reflectColor.g * opacity),
			b: Math.round(reflectColor.b * opacity),
		};

		const segWidth = reflectWidth - i * 2;
		const segHeight = (riverHeight - 15) / segments;

		if (segWidth > 0) {
			elements.push(rectangle(segmentX, segmentY, segWidth, segHeight, segColor));
		}
	}

	return elements;
}
