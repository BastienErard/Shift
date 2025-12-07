import type { Element } from "../types";
import type { WorldConditions } from "../conditions";
import { circle, rectangle } from "../types";
import { getSunColor, getCloudPalette, CELESTIAL_PALETTE, darkenColor } from "../palette";
import { CANVAS_WIDTH, CANVAS_HEIGHT, HORIZON_Y } from "../types";
import { isNight, isGoldenHour } from "../conditions";

/* Crée le soleil */
export function createSun(conditions: WorldConditions): Element[] {
	// Pas de soleil la nuit
	if (isNight(conditions)) {
		return [];
	}

	const elements: Element[] = [];

	// Taille du soleil (plus gros à l'aube/crépuscule pour effet de perspective)
	const radius = isGoldenHour(conditions) ? 55 : 40;

	// Couleurs du soleil selon le moment
	// Aube : orange rosé, Journée : jaune vif, Crépuscule : rouge orangé
	let sunColor: { r: number; g: number; b: number };
	if (conditions.timeOfDay === "dawn") {
		sunColor = { r: 255, g: 150, b: 100 }; // Orange rosé
	} else if (conditions.timeOfDay === "dusk") {
		sunColor = { r: 255, g: 100, b: 60 }; // Rouge orangé
	} else {
		sunColor = { r: 255, g: 220, b: 50 }; // Jaune vif
	}

	// Positions du soleil selon le moment
	// À l'aube : soleil à peine levé à gauche (partiellement visible)
	// Au crépuscule : soleil qui se couche à droite (partiellement visible)
	const sunPositions: Record<string, { x: number; y: number }> = {
		dawn: { x: CANVAS_WIDTH * 0.08, y: HORIZON_Y - radius * 0.3 }, // Soleil levant à gauche
		morning: { x: CANVAS_WIDTH * 0.25, y: CANVAS_HEIGHT * 0.18 },
		noon: { x: CANVAS_WIDTH * 0.5, y: CANVAS_HEIGHT * 0.08 },
		afternoon: { x: CANVAS_WIDTH * 0.75, y: CANVAS_HEIGHT * 0.18 },
		dusk: { x: CANVAS_WIDTH * 0.92, y: HORIZON_Y - radius * 0.3 }, // Soleil couchant à droite
	};

	const position = sunPositions[conditions.timeOfDay] || sunPositions.noon;

	// Soleil simple sans halo
	elements.push(circle(position.x, position.y, radius, sunColor, "sky"));

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

/**
 * Crée une étoile filante animée
 * Apparaît de temps en temps la nuit
 */
export function createShootingStar(conditions: WorldConditions, animationOffset: number): Element[] {
	if (!isNight(conditions)) {
		return [];
	}

	const elements: Element[] = [];

	// Cycle d'apparition : une étoile filante toutes les ~10 secondes (600 frames à 60fps)
	const cycleLength = 600;
	const shootingDuration = 60; // Durée de l'animation (1 seconde)

	// Plusieurs "slots" d'étoiles filantes avec des timings différents
	const shootingStarSlots = [
		{ startFrame: 0, startX: 100, startY: 30, endX: 250, endY: 120 },
		{ startFrame: 200, startX: 500, startY: 50, endX: 650, endY: 140 },
		{ startFrame: 400, startX: 300, startY: 20, endX: 480, endY: 100 },
	];

	const cyclePosition = animationOffset % cycleLength;

	for (const slot of shootingStarSlots) {
		const relativeFrame = cyclePosition - slot.startFrame;

		// Vérifie si on est dans la fenêtre d'animation de cette étoile
		if (relativeFrame >= 0 && relativeFrame < shootingDuration) {
			const progress = relativeFrame / shootingDuration;

			// Position actuelle de l'étoile
			const currentX = slot.startX + (slot.endX - slot.startX) * progress;
			const currentY = slot.startY + (slot.endY - slot.startY) * progress;

			// Opacité : apparaît puis disparaît
			const opacity = progress < 0.3 ? progress / 0.3 : (1 - progress) / 0.7;

			// Couleur avec opacité simulée
			const starColor = {
				r: Math.round(255 * opacity),
				g: Math.round(255 * opacity),
				b: Math.round(220 * opacity),
			};

			// Tête de l'étoile filante
			elements.push(rectangle(currentX, currentY, 4, 4, starColor, "sky"));

			// Traînée (plusieurs points de plus en plus petits et transparents)
			const trailLength = 5;
			for (let i = 1; i <= trailLength; i++) {
				const trailProgress = (i / trailLength) * 0.3;
				const trailX = currentX - (slot.endX - slot.startX) * trailProgress;
				const trailY = currentY - (slot.endY - slot.startY) * trailProgress;
				const trailOpacity = opacity * (1 - i / (trailLength + 1));

				const trailColor = {
					r: Math.round(200 * trailOpacity),
					g: Math.round(200 * trailOpacity),
					b: Math.round(180 * trailOpacity),
				};

				const size = Math.max(1, 4 - i);
				elements.push(rectangle(trailX, trailY, size, size, trailColor, "sky"));
			}
		}
	}

	return elements;
}

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
			// Ombres profondes (dessous)
			deep: [
				{ x: 0, y: baseRadius * 0.8, r: baseRadius * 0.7 },
				{ x: baseRadius * 1.2, y: baseRadius * 0.9, r: baseRadius * 0.6 },
			],
			// Ombres
			shadow: [
				{ x: -baseRadius * 0.3, y: baseRadius * 0.5, r: baseRadius * 0.9 },
				{ x: baseRadius * 0.8, y: baseRadius * 0.6, r: baseRadius * 0.8 },
				{ x: baseRadius * 1.8, y: baseRadius * 0.5, r: baseRadius * 0.7 },
			],
			// Corps principal
			main: [
				{ x: -baseRadius * 0.5, y: 0, r: baseRadius * 1.1 },
				{ x: baseRadius * 0.6, y: -baseRadius * 0.2, r: baseRadius * 1.2 },
				{ x: baseRadius * 1.7, y: 0, r: baseRadius * 0.9 },
				{ x: baseRadius * 0.2, y: baseRadius * 0.3, r: baseRadius },
			],
			// Reflets (dessus)
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

/* Crée plusieurs nuages massifs répartis dans le ciel */
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
	// En mode manuel : windDirection sera "left" (-1) ou "right" (1) converti en nombre
	// En mode live : on interprète les points cardinaux pour déterminer gauche/droite
	// Vent d'ouest (270) = vient de l'ouest = pousse vers l'est = vers la droite
	// Vent d'est (90) = vient de l'est = pousse vers l'ouest = vers la gauche
	const actualWindSpeed = windSpeed ?? 10;

	// Déterminer la direction : -1 = vers la gauche, +1 = vers la droite
	let windDirectionSign = 1; // Par défaut vers la droite
	if (windDirection !== undefined) {
		// Convertir les degrés en direction gauche/droite
		// 0-180 (N à S en passant par E) = composante Est = vent pousse vers l'Ouest = gauche
		// 180-360 (S à N en passant par W) = composante Ouest = vent pousse vers l'Est = droite
		if (windDirection >= 0 && windDirection < 180) {
			windDirectionSign = -1; // Vers la gauche
		} else {
			windDirectionSign = 1; // Vers la droite
		}
	}

	// Vitesse de déplacement proportionnelle à la vitesse du vent
	// Plus le vent est fort, plus les nuages bougent vite
	const speedFactor = actualWindSpeed / 30; // Normalise : 30 km/h = vitesse "normale"
	const windMovement = (animationOffset * speedFactor * windDirectionSign * 0.5) % (CANVAS_WIDTH + 400);

	// Configuration des nuages selon la couverture
	// Positions Y plus basses pour meilleure visibilité (positives = plus bas dans le canvas)
	interface CloudConfig {
		x: number;
		y: number;
		scale: number;
		variant: number;
	}

	const configs: CloudConfig[] = [];

	if (coverage < 20) {
		// Quelques petits nuages épars
		configs.push(
			{ x: -50, y: 20, scale: 0.7, variant: 0 },
			{ x: CANVAS_WIDTH * 0.6, y: 30, scale: 0.6, variant: 1 }
		);
	} else if (coverage < 40) {
		// Nuages modérés
		configs.push(
			{ x: -80, y: 10, scale: 0.9, variant: 0 },
			{ x: CANVAS_WIDTH * 0.3, y: 25, scale: 0.75, variant: 2 },
			{ x: CANVAS_WIDTH * 0.7, y: 15, scale: 0.85, variant: 1 }
		);
	} else if (coverage < 60) {
		// Ciel bien nuageux
		configs.push(
			{ x: -100, y: 0, scale: 1.1, variant: 2 },
			{ x: CANVAS_WIDTH * 0.15, y: 20, scale: 0.9, variant: 0 },
			{ x: CANVAS_WIDTH * 0.45, y: 5, scale: 1.0, variant: 1 },
			{ x: CANVAS_WIDTH * 0.75, y: 15, scale: 0.95, variant: 2 }
		);
	} else if (coverage < 80) {
		// Ciel très nuageux
		configs.push(
			{ x: -120, y: -10, scale: 1.3, variant: 0 },
			{ x: CANVAS_WIDTH * 0.05, y: 10, scale: 1.1, variant: 2 },
			{ x: CANVAS_WIDTH * 0.3, y: -5, scale: 1.2, variant: 1 },
			{ x: CANVAS_WIDTH * 0.55, y: 5, scale: 1.15, variant: 0 },
			{ x: CANVAS_WIDTH * 0.8, y: 0, scale: 1.25, variant: 2 }
		);
	} else {
		// Ciel couvert (orage, pluie intense)
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
		// Position X avec déplacement du vent (cycle continu)
		let animatedX = config.x + windMovement;

		// Gestion du cycle : les nuages sortent d'un côté et réapparaissent de l'autre
		if (windDirectionSign > 0) {
			// Vent vers la droite
			while (animatedX > CANVAS_WIDTH + 100) {
				animatedX -= totalWidth;
			}
			while (animatedX < -300) {
				animatedX += totalWidth;
			}
		} else {
			// Vent vers la gauche
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
 * Crée tous les éléments du ciel
 */
export function createSkyElements(
	conditions: WorldConditions,
	cloudCover?: number,
	animationOffset: number = 0
): Element[] {
	const elements: Element[] = [];

	// Soleil ou Lune
	if (isNight(conditions)) {
		elements.push(...createMoon(conditions));
		elements.push(...createStars(conditions));
	} else {
		elements.push(...createSun(conditions));
	}

	// Nuages avec couverture dynamique et animation
	elements.push(...createClouds(conditions, cloudCover, animationOffset));

	return elements;
}

/* Calcule la position Y la plus basse des nuages selon la couverture */
export function getCloudBottomY(conditions: WorldConditions): number {
	const { weather, cloudCover } = conditions;

	// Base pour les nuages massifs
	let baseY = 80;

	// Ajuste selon la météo
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

	// Ajuste selon la couverture
	if (cloudCover !== undefined) {
		if (cloudCover > 80) baseY += 20;
		else if (cloudCover > 60) baseY += 10;
	}

	return baseY;
}
