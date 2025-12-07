// lib/canvas/elements/sky/clouds.ts

import type { Element } from "../../types";
import type { WorldConditions } from "../../conditions";
import { circle, CANVAS_WIDTH } from "../../types";
import { getCloudPalette } from "../../palette";

/**
 * Crée un nuage avec des formes arrondies (cercles) pour un effet plus naturel
 */
function createMassiveCloud(
	conditions: WorldConditions,
	positionX: number,
	positionY: number,
	scale: number = 1.0,
	variant: number = 0
): Element[] {
	const elements: Element[] = [];
	const palette = getCloudPalette(conditions);

	// Rayon de base
	const baseRadius = 45 * scale;

	// Différentes configurations de cercles selon le variant
	const cloudConfigs = [
		// Variant 0 : Nuage cumulus classique
		{
			deep: [
				{ x: 0, y: baseRadius * 0.8, r: baseRadius * 0.7 },
				{ x: baseRadius * 1.2, y: baseRadius * 0.9, r: baseRadius * 0.6 },
			],
			shadow: [
				{ x: -baseRadius * 0.3, y: baseRadius * 0.5, r: baseRadius * 0.9 },
				{ x: baseRadius * 0.8, y: baseRadius * 0.6, r: baseRadius * 0.8 },
				{ x: baseRadius * 1.8, y: baseRadius * 0.5, r: baseRadius * 0.7 },
			],
			main: [
				{ x: -baseRadius * 0.5, y: 0, r: baseRadius * 1.1 },
				{ x: baseRadius * 0.6, y: -baseRadius * 0.2, r: baseRadius * 1.2 },
				{ x: baseRadius * 1.7, y: 0, r: baseRadius * 0.9 },
				{ x: baseRadius * 0.2, y: baseRadius * 0.3, r: baseRadius },
			],
			highlight: [
				{ x: -baseRadius * 0.3, y: -baseRadius * 0.5, r: baseRadius * 0.7 },
				{ x: baseRadius * 0.5, y: -baseRadius * 0.7, r: baseRadius * 0.8 },
				{ x: baseRadius * 1.4, y: -baseRadius * 0.4, r: baseRadius * 0.5 },
			],
		},
		// Variant 1 : Nuage étiré horizontal
		{
			deep: [
				{ x: baseRadius * 0.5, y: baseRadius * 0.7, r: baseRadius * 0.5 },
				{ x: baseRadius * 2, y: baseRadius * 0.6, r: baseRadius * 0.4 },
			],
			shadow: [
				{ x: 0, y: baseRadius * 0.4, r: baseRadius * 0.8 },
				{ x: baseRadius * 1.3, y: baseRadius * 0.5, r: baseRadius * 0.7 },
				{ x: baseRadius * 2.5, y: baseRadius * 0.4, r: baseRadius * 0.6 },
			],
			main: [
				{ x: -baseRadius * 0.3, y: 0, r: baseRadius },
				{ x: baseRadius * 0.8, y: -baseRadius * 0.1, r: baseRadius * 1.1 },
				{ x: baseRadius * 2, y: 0, r: baseRadius * 0.9 },
				{ x: baseRadius * 3, y: baseRadius * 0.1, r: baseRadius * 0.7 },
			],
			highlight: [
				{ x: 0, y: -baseRadius * 0.4, r: baseRadius * 0.6 },
				{ x: baseRadius, y: -baseRadius * 0.5, r: baseRadius * 0.7 },
				{ x: baseRadius * 2.2, y: -baseRadius * 0.3, r: baseRadius * 0.5 },
			],
		},
		// Variant 2 : Gros nuage cumulus vertical
		{
			deep: [
				{ x: baseRadius * 0.3, y: baseRadius * 1.2, r: baseRadius * 0.8 },
			],
			shadow: [
				{ x: -baseRadius * 0.2, y: baseRadius * 0.7, r: baseRadius },
				{ x: baseRadius * 0.9, y: baseRadius * 0.8, r: baseRadius * 0.9 },
			],
			main: [
				{ x: 0, y: 0, r: baseRadius * 1.3 },
				{ x: baseRadius, y: -baseRadius * 0.3, r: baseRadius * 1.1 },
				{ x: -baseRadius * 0.5, y: baseRadius * 0.4, r: baseRadius },
				{ x: baseRadius * 0.5, y: baseRadius * 0.5, r: baseRadius * 1.1 },
			],
			highlight: [
				{ x: -baseRadius * 0.2, y: -baseRadius * 0.6, r: baseRadius * 0.8 },
				{ x: baseRadius * 0.7, y: -baseRadius * 0.8, r: baseRadius * 0.7 },
			],
		},
	];

	const config = cloudConfigs[variant % cloudConfigs.length];

	// Dessine les ombres profondes
	for (const c of config.deep) {
		elements.push(
			circle(positionX + c.x, positionY + c.y, c.r, palette.deep, "sky")
		);
	}

	// Dessine les ombres
	for (const c of config.shadow) {
		elements.push(
			circle(positionX + c.x, positionY + c.y, c.r, palette.shadow, "sky")
		);
	}

	// Dessine le corps principal
	for (const c of config.main) {
		elements.push(
			circle(positionX + c.x, positionY + c.y, c.r, palette.base, "sky")
		);
	}

	// Dessine les reflets
	for (const c of config.highlight) {
		elements.push(
			circle(positionX + c.x, positionY + c.y, c.r, palette.light, "sky")
		);
	}

	return elements;
}

/**
 * Crée plusieurs nuages massifs répartis dans le ciel
 */
export function createClouds(
	conditions: WorldConditions,
	cloudCover?: number,
	animationOffset: number = 0
): Element[] {
	const elements: Element[] = [];
	const { weather, windSpeed, windDirection } = conditions;

	// Si cloudCover n'est pas fourni, estime selon la météo
	let coverage = cloudCover;

	if (coverage === undefined) {
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

	// Pas de nuages si couverture très faible
	if (coverage < 5) {
		return [];
	}

	// Calcul du déplacement horizontal dû au vent
	const actualWindSpeed = windSpeed ?? 10;

	// Déterminer la direction : -1 = vers la gauche, +1 = vers la droite
	let windDirectionSign = 1;
	if (windDirection !== undefined) {
		if (windDirection >= 0 && windDirection < 180) {
			windDirectionSign = -1; // Vers la gauche
		} else {
			windDirectionSign = 1; // Vers la droite
		}
	}

	// Vitesse de déplacement proportionnelle à la vitesse du vent
	const speedFactor = actualWindSpeed / 30;
	const windMovement = (animationOffset * speedFactor * windDirectionSign * 0.5) % (CANVAS_WIDTH + 400);

	// Configuration des nuages selon la couverture
	interface CloudConfig {
		x: number;
		y: number;
		scale: number;
		variant: number;
	}

	const configs: CloudConfig[] = [];

	if (coverage < 20) {
		configs.push(
			{ x: -50, y: 20, scale: 0.7, variant: 0 },
			{ x: CANVAS_WIDTH * 0.6, y: 30, scale: 0.6, variant: 1 }
		);
	} else if (coverage < 40) {
		configs.push(
			{ x: -80, y: 10, scale: 0.9, variant: 0 },
			{ x: CANVAS_WIDTH * 0.3, y: 25, scale: 0.75, variant: 2 },
			{ x: CANVAS_WIDTH * 0.7, y: 15, scale: 0.85, variant: 1 }
		);
	} else if (coverage < 60) {
		configs.push(
			{ x: -100, y: 0, scale: 1.1, variant: 2 },
			{ x: CANVAS_WIDTH * 0.15, y: 20, scale: 0.9, variant: 0 },
			{ x: CANVAS_WIDTH * 0.45, y: 5, scale: 1.0, variant: 1 },
			{ x: CANVAS_WIDTH * 0.75, y: 15, scale: 0.95, variant: 2 }
		);
	} else if (coverage < 80) {
		configs.push(
			{ x: -120, y: -10, scale: 1.3, variant: 0 },
			{ x: CANVAS_WIDTH * 0.05, y: 10, scale: 1.1, variant: 2 },
			{ x: CANVAS_WIDTH * 0.3, y: -5, scale: 1.2, variant: 1 },
			{ x: CANVAS_WIDTH * 0.55, y: 5, scale: 1.15, variant: 0 },
			{ x: CANVAS_WIDTH * 0.8, y: 0, scale: 1.25, variant: 2 }
		);
	} else {
		configs.push(
			{ x: -150, y: -20, scale: 1.5, variant: 0 },
			{ x: -50, y: 0, scale: 1.3, variant: 2 },
			{ x: CANVAS_WIDTH * 0.15, y: -10, scale: 1.4, variant: 1 },
			{ x: CANVAS_WIDTH * 0.35, y: -5, scale: 1.35, variant: 0 },
			{ x: CANVAS_WIDTH * 0.55, y: -15, scale: 1.45, variant: 2 },
			{ x: CANVAS_WIDTH * 0.75, y: -5, scale: 1.3, variant: 1 },
			{ x: CANVAS_WIDTH - 100, y: -10, scale: 1.4, variant: 0 }
		);
	}

	// Largeur totale pour le cycle de défilement
	const totalWidth = CANVAS_WIDTH + 400;

	// Crée chaque nuage massif avec animation de vent
	for (const config of configs) {
		let animatedX = config.x + windMovement;

		// Gestion du cycle
		if (windDirectionSign > 0) {
			while (animatedX > CANVAS_WIDTH + 100) {
				animatedX -= totalWidth;
			}
			while (animatedX < -300) {
				animatedX += totalWidth;
			}
		} else {
			while (animatedX < -300) {
				animatedX += totalWidth;
			}
			while (animatedX > CANVAS_WIDTH + 100) {
				animatedX -= totalWidth;
			}
		}

		elements.push(
			...createMassiveCloud(conditions, animatedX, config.y, config.scale, config.variant)
		);
	}

	return elements;
}

/**
 * Calcule la position Y la plus basse des nuages selon la couverture
 */
export function getCloudBottomY(conditions: WorldConditions): number {
	const { weather, cloudCover } = conditions;

	let baseY = 80;

	switch (weather) {
		case "clear":
			return 120;
		case "cloudy":
			baseY = 100;
			break;
		case "rain":
		case "storm":
			baseY = 120;
			break;
		case "snow":
			baseY = 110;
			break;
	}

	if (cloudCover !== undefined) {
		if (cloudCover > 80) baseY += 20;
		else if (cloudCover > 60) baseY += 10;
	}

	return baseY;
}
