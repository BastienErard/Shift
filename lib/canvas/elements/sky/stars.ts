// lib/canvas/elements/sky/stars.ts

import type { Element } from "../../types";
import type { WorldConditions } from "../../conditions";
import { rectangle, CANVAS_WIDTH } from "../../types";
import { CELESTIAL_PALETTE } from "../../palette";
import { isNight } from "../../conditions";

/**
 * Crée les étoiles
 */
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
