import type { Element } from "../types";
import type { WorldConditions } from "../conditions";
import { circle, rectangle, pixelGrid } from "../types";
import { getSunColor, getCloudColor, CELESTIAL_PALETTE } from "../palette";
import { CANVAS_WIDTH, CANVAS_HEIGHT, HORIZON_Y } from "../types";
import { isNight, isGoldenHour } from "../conditions";

/* Crée le soleil */
export function createSun(conditions: WorldConditions): Element[] {
	// Pas de soleil la nuit
	if (isNight(conditions)) {
		return [];
	}

	const elements: Element[] = [];
	const color = getSunColor(conditions);

	/* Position du soleil selon le moment */
	const sunPositions: Record<string, { x: number; y: number }> = {
		dawn: { x: CANVAS_WIDTH * 0.15, y: HORIZON_Y - 20 },
		morning: { x: CANVAS_WIDTH * 0.3, y: CANVAS_HEIGHT * 0.2 },
		noon: { x: CANVAS_WIDTH * 0.5, y: CANVAS_HEIGHT * 0.1 },
		afternoon: { x: CANVAS_WIDTH * 0.7, y: CANVAS_HEIGHT * 0.2 },
		dusk: { x: CANVAS_WIDTH * 0.85, y: HORIZON_Y - 20 },
	};

	const position = sunPositions[conditions.timeOfDay] || sunPositions.noon;
	const radius = isGoldenHour(conditions) ? 50 : 40; // Plus gros à l'aube/crépuscule

	// Soleil principal
	elements.push(circle(position.x, position.y, radius, color));

	return elements;
}

/* Crée la lune */
export function createMoon(conditions: WorldConditions): Element[] {
	// Lune uniquement la nuit
	if (!isNight(conditions)) {
		return [];
	}

	const elements: Element[] = [];

	const moonX = CANVAS_WIDTH - 120;
	const moonY = 80;
	const moonRadius = 35;

	// Lune principale
	elements.push(circle(moonX, moonY, moonRadius, CELESTIAL_PALETTE.moon));

	/* Cratères (petits cercles plus sombres) */
	const craterColor = { r: 200, g: 200, b: 180 };

	elements.push(
		circle(moonX - 10, moonY - 8, 6, craterColor),
		circle(moonX + 8, moonY + 5, 4, craterColor),
		circle(moonX - 5, moonY + 12, 5, craterColor)
	);

	return elements;
}

/* Crée les étoiles */
export function createStars(conditions: WorldConditions): Element[] {
	if (!isNight(conditions)) {
		return [];
	}

	const elements: Element[] = [];

	/* Positions des étoiles */
	const bigStars = [
		{ x: 50, y: 50 },
		{ x: 120, y: 30 },
		{ x: 200, y: 70 },
		{ x: 280, y: 40 },
		{ x: 350, y: 90 },
		{ x: 450, y: 55 },
		{ x: 520, y: 35 },
		{ x: 600, y: 75 },
		{ x: 680, y: 45 },
		{ x: 750, y: 85 },
	];

	const smallStars = [
		{ x: 80, y: 100 },
		{ x: 150, y: 65 },
		{ x: 180, y: 110 },
		{ x: 250, y: 85 },
		{ x: 320, y: 60 },
		{ x: 400, y: 95 },
		{ x: 480, y: 70 },
		{ x: 550, y: 105 },
		{ x: 620, y: 50 },
		{ x: 700, y: 90 },
		{ x: 770, y: 65 },
	];

	// Grandes étoiles (2x2 pixels)
	for (const star of bigStars) {
		elements.push(rectangle(star.x, star.y, 4, 4, CELESTIAL_PALETTE.stars));
	}

	// Petites étoiles (1x1 pixel, plus sombres)
	for (const star of smallStars) {
		elements.push(rectangle(star.x, star.y, 2, 2, CELESTIAL_PALETTE.starsDim));
	}

	return elements;
}

/* Crée un nuage */
export function createCloud(
	conditions: WorldConditions,
	positionX: number,
	positionY: number,
	size: "small" | "medium" | "large" = "medium"
): Element[] {
	const elements: Element[] = [];
	const color = getCloudColor(conditions);

	/* Grilles de pixels pour chaque taille de nuage */
	const cloudShapes = {
		small: [
			[false, true, true, true, false],
			[true, true, true, true, true],
			[false, true, true, true, false],
		],
		medium: [
			[false, false, true, true, true, true, false, false],
			[false, true, true, true, true, true, true, false],
			[true, true, true, true, true, true, true, true],
			[false, true, true, true, true, true, true, false],
		],
		large: [
			[false, false, false, true, true, true, true, false, false, false],
			[false, false, true, true, true, true, true, true, false, false],
			[false, true, true, true, true, true, true, true, true, false],
			[true, true, true, true, true, true, true, true, true, true],
			[false, true, true, true, true, true, true, true, true, false],
		],
	};

	/* Taille d'un pixel selon la taille du nuage */
	const pixelSizes = {
		small: 4,
		medium: 5,
		large: 6,
	};

	elements.push(pixelGrid(positionX, positionY, pixelSizes[size], cloudShapes[size], color));

	return elements;
}

/* Crée plusieurs nuages répartis dans le ciel */
export function createClouds(conditions: WorldConditions): Element[] {
	const elements: Element[] = [];
	const { weather } = conditions;

	/* Configuration des nuages selon la météo */
	type CloudConfig = { x: number; y: number; size: "small" | "medium" | "large" };

	let cloudConfigs: CloudConfig[] = [];

	switch (weather) {
		case "clear":
			// Peu de nuages, petits et dispersés
			cloudConfigs = [
				{ x: 100, y: 60, size: "small" },
				{ x: 500, y: 80, size: "small" },
			];
			break;

		case "cloudy":
			// Beaucoup de nuages, variés
			cloudConfigs = [
				{ x: 50, y: 50, size: "medium" },
				{ x: 200, y: 70, size: "large" },
				{ x: 400, y: 55, size: "medium" },
				{ x: 580, y: 75, size: "large" },
				{ x: 720, y: 60, size: "medium" },
			];
			break;

		case "rain":
		case "storm":
			// Gros nuages sombres
			cloudConfigs = [
				{ x: 30, y: 40, size: "large" },
				{ x: 220, y: 50, size: "large" },
				{ x: 450, y: 45, size: "large" },
				{ x: 650, y: 55, size: "large" },
			];
			break;

		case "snow":
			// Nuages neigeux (gris clair)
			cloudConfigs = [
				{ x: 80, y: 45, size: "large" },
				{ x: 300, y: 60, size: "medium" },
				{ x: 520, y: 50, size: "large" },
				{ x: 700, y: 65, size: "medium" },
			];
			break;
	}

	// Crée chaque nuage
	for (const config of cloudConfigs) {
		elements.push(...createCloud(conditions, config.x, config.y, config.size));
	}

	return elements;
}

/* Crée tous les éléments du ciel */
export function createSkyElements(conditions: WorldConditions): Element[] {
	const elements: Element[] = [];

	// Soleil ou Lune
	if (isNight(conditions)) {
		elements.push(...createMoon(conditions));
		elements.push(...createStars(conditions));
	} else {
		elements.push(...createSun(conditions));
	}

	// Nuages (toujours, mais quantité/couleur varient)
	elements.push(...createClouds(conditions));

	return elements;
}
