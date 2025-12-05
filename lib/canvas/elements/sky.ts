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

	// Taille du soleil (plus gros à l'aube/crépuscule)
	const radius = isGoldenHour(conditions) ? 50 : 40;

	const sunPositions: Record<string, { x: number; y: number }> = {
		dawn: { x: CANVAS_WIDTH * 0.15, y: HORIZON_Y + radius * 0.3 },
		morning: { x: CANVAS_WIDTH * 0.25, y: CANVAS_HEIGHT * 0.18 },
		noon: { x: CANVAS_WIDTH * 0.5, y: CANVAS_HEIGHT * 0.08 },
		afternoon: { x: CANVAS_WIDTH * 0.75, y: CANVAS_HEIGHT * 0.18 },
		dusk: { x: CANVAS_WIDTH * 0.85, y: HORIZON_Y + radius * 0.3 },
	};

	const position = sunPositions[conditions.timeOfDay] || sunPositions.noon;

	// Soleil principal avec z-index "sky"
	elements.push(circle(position.x, position.y, radius, color, "sky"));

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

	// Lune principale avec z-index "sky"
	elements.push(circle(moonX, moonY, moonRadius, CELESTIAL_PALETTE.moon, "sky"));

	// Cratères (petits cercles plus sombres) avec z-index "sky"
	const craterColor = { r: 200, g: 200, b: 180 };

	elements.push(
		circle(moonX - 10, moonY - 8, 6, craterColor, "sky"),
		circle(moonX + 8, moonY + 5, 4, craterColor, "sky"),
		circle(moonX - 5, moonY + 12, 5, craterColor, "sky")
	);

	return elements;
}

/* Crée les étoiles */
export function createStars(conditions: WorldConditions): Element[] {
	if (!isNight(conditions)) {
		return [];
	}

	const elements: Element[] = [];

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

	// Grandes étoiles avec z-index "sky"
	for (const star of bigStars) {
		elements.push(rectangle(star.x, star.y, 4, 4, CELESTIAL_PALETTE.stars, "sky"));
	}

	// Petites étoiles avec z-index "sky"
	for (const star of smallStars) {
		elements.push(rectangle(star.x, star.y, 2, 2, CELESTIAL_PALETTE.starsDim, "sky"));
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

	const pixelSizes = {
		small: 4,
		medium: 5,
		large: 6,
	};

	// Nuage avec z-index "sky"
	elements.push(pixelGrid(positionX, positionY, pixelSizes[size], cloudShapes[size], color, "sky"));

	return elements;
}

/* Crée plusieurs nuages répartis dans le ciel */
export function createClouds(conditions: WorldConditions, cloudCover?: number): Element[] {
	const elements: Element[] = [];
	const { weather } = conditions;

	// Si cloudCover n'est pas fourni, estime selon la météo
	let coverage = cloudCover;

	if (coverage === undefined) {
		// Estimation par défaut selon le type de météo
		switch (weather) {
			case "clear":
				coverage = 0;
				break;
			case "cloudy":
				coverage = 70;
				break;
			case "rain":
			case "storm":
				coverage = 90;
				break;
			case "snow":
				coverage = 80;
				break;
		}
	}

	// Détermine le nombre de nuages selon la couverture
	let cloudCount: number;
	let sizeMix: ("small" | "medium" | "large")[];

	if (coverage < 10) {
		// Ciel dégagé : 0-1 nuages
		cloudCount = coverage > 5 ? 1 : 0;
		sizeMix = ["small"];
	} else if (coverage < 25) {
		// Peu nuageux : 2-3 nuages
		cloudCount = 2 + Math.floor((coverage - 10) / 8);
		sizeMix = ["small", "medium", "small"];
	} else if (coverage < 50) {
		// Partiellement nuageux : 4-6 nuages
		cloudCount = 4 + Math.floor((coverage - 25) / 5);
		sizeMix = ["medium", "large", "medium", "small", "large", "medium"];
	} else if (coverage < 75) {
		// Nuageux : 7-10 nuages
		cloudCount = 7 + Math.floor((coverage - 50) / 4);
		sizeMix = [
			"large",
			"large",
			"medium",
			"large",
			"medium",
			"large",
			"medium",
			"large",
			"medium",
			"large",
		];
	} else {
		// Très nuageux : 11-15 nuages
		cloudCount = 11 + Math.floor((coverage - 75) / 5);
		sizeMix = [
			"large",
			"large",
			"large",
			"large",
			"large",
			"medium",
			"large",
			"large",
			"large",
			"medium",
			"large",
			"large",
			"large",
			"large",
			"large",
		];
	}

	// Pas de nuages si couverture = 0
	if (cloudCount === 0) {
		return [];
	}

	// Génère les positions des nuages de façon répartie
	const cloudConfigs: { x: number; y: number; size: "small" | "medium" | "large" }[] = [];

	for (let i = 0; i < cloudCount; i++) {
		// Position X : répartition régulière avec variation
		const baseX = (i * CANVAS_WIDTH) / cloudCount;
		const offsetX = ((i * 37) % 60) - 30; // Variation aléatoire
		const x = Math.max(20, Math.min(CANVAS_WIDTH - 100, baseX + offsetX));

		// Position Y : entre 40 et 100 pixels du haut
		const y = 40 + ((i * 23) % 50);

		// Taille : prend dans le mix selon l'index
		const size = sizeMix[i % sizeMix.length];

		cloudConfigs.push({ x, y, size });
	}

	// Crée chaque nuage
	for (const config of cloudConfigs) {
		elements.push(...createCloud(conditions, config.x, config.y, config.size));
	}

	return elements;
}

/**
 * Crée tous les éléments du ciel
 */
export function createSkyElements(conditions: WorldConditions, cloudCover?: number): Element[] {
	const elements: Element[] = [];

	// Soleil ou Lune
	if (isNight(conditions)) {
		elements.push(...createMoon(conditions));
		elements.push(...createStars(conditions));
	} else {
		elements.push(...createSun(conditions));
	}

	// Nuages avec couverture dynamique
	elements.push(...createClouds(conditions, cloudCover));

	return elements;
}

/* Calcule la position Y la plus basse des nuages selon la météo */
export function getCloudBottomY(conditions: WorldConditions): number {
	const { weather } = conditions;

	type CloudConfig = { x: number; y: number; size: "small" | "medium" | "large" };

	let cloudConfigs: CloudConfig[] = [];

	// Récupère la config des nuages (même logique que createClouds)
	switch (weather) {
		case "clear":
			return 120; // Pas de nuages, position par défaut

		case "cloudy":
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
			cloudConfigs = [
				{ x: 30, y: 40, size: "large" },
				{ x: 220, y: 50, size: "large" },
				{ x: 450, y: 45, size: "large" },
				{ x: 650, y: 55, size: "large" },
			];
			break;

		case "snow":
			cloudConfigs = [
				{ x: 80, y: 45, size: "large" },
				{ x: 300, y: 60, size: "medium" },
				{ x: 520, y: 50, size: "large" },
				{ x: 700, y: 65, size: "medium" },
			];
			break;
	}

	// Hauteur d'un nuage selon sa taille
	const cloudHeights = {
		small: 3 * 4, // 3 rows × 4px
		medium: 4 * 5, // 4 rows × 5px
		large: 5 * 6, // 5 rows × 6px
	};

	// Trouve le nuage le plus bas
	let lowestY = 0;

	for (const cloud of cloudConfigs) {
		const cloudBottom = cloud.y + cloudHeights[cloud.size];
		if (cloudBottom > lowestY) {
			lowestY = cloudBottom;
		}
	}

	// Ajoute une marge de sécurité
	return lowestY + 10;
}
