// lib/canvas/elements/weather/lightning.ts

import type { Element } from "../../types";
import type { WorldConditions } from "../../conditions";
import { rectangle, CANVAS_WIDTH, HORIZON_Y } from "../../types";
import { getCloudBottomY } from "../sky";

/**
 * Générateur pseudo-aléatoire déterministe (seed-based)
 * Permet d'avoir des éclairs "aléatoires" mais reproductibles à chaque frame
 */
function seededRandom(seed: number): () => number {
	let s = seed;
	return () => {
		s = (s * 9301 + 49297) % 233280;
		return s / 233280;
	};
}

/**
 * Génère un chemin d'éclair en zigzag naturel
 */
function generateLightningPath(
	startX: number,
	startY: number,
	endY: number,
	random: () => number
): { x: number; y: number }[] {
	const points: { x: number; y: number }[] = [{ x: startX, y: startY }];

	let currentX = startX;
	let currentY = startY;

	// Nombre de segments basé sur la hauteur
	const height = endY - startY;
	const numSegments = Math.floor(height / 25) + 3;

	for (let i = 0; i < numSegments; i++) {
		// Déviation horizontale (plus grande au milieu)
		const progress = i / numSegments;
		const maxDeviation = 40 * Math.sin(progress * Math.PI);
		const deviation = (random() - 0.5) * maxDeviation;

		currentX += deviation;
		currentY += height / numSegments;

		points.push({ x: currentX, y: currentY });
	}

	// Point final
	points.push({ x: currentX + (random() - 0.5) * 20, y: endY });

	return points;
}

/**
 * Génère une branche secondaire d'éclair
 */
function generateBranch(
	startX: number,
	startY: number,
	direction: number, // -1 = gauche, 1 = droite
	length: number,
	random: () => number
): { x: number; y: number }[] {
	const points: { x: number; y: number }[] = [{ x: startX, y: startY }];

	let currentX = startX;
	let currentY = startY;
	const numSegments = Math.floor(length / 20) + 2;

	for (let i = 0; i < numSegments; i++) {
		currentX += direction * (15 + random() * 15);
		currentY += 15 + random() * 20;
		points.push({ x: currentX, y: currentY });
	}

	return points;
}

/**
 * Convertit un chemin en éléments rectangles (style pixel art)
 */
function pathToElements(
	path: { x: number; y: number }[],
	thickness: number,
	color: { r: number; g: number; b: number }
): Element[] {
	const elements: Element[] = [];

	for (let i = 0; i < path.length - 1; i++) {
		const p1 = path[i];
		const p2 = path[i + 1];

		// Dessine des rectangles le long du segment
		const dx = p2.x - p1.x;
		const dy = p2.y - p1.y;
		const steps = Math.max(Math.abs(dx), Math.abs(dy)) / 4;

		for (let s = 0; s <= steps; s++) {
			const t = s / Math.max(steps, 1);
			const x = Math.round(p1.x + dx * t);
			const y = Math.round(p1.y + dy * t);

			elements.push(rectangle(x - thickness / 2, y, thickness, 4, color));
		}
	}

	return elements;
}

/**
 * Crée des éclairs animés réalistes pour les orages
 *
 * Caractéristiques :
 * - Forme en zigzag naturelle avec branches
 * - Flash lumineux sur l'écran
 * - Timing réaliste (éclair bref, pause longue)
 * - Positions aléatoires dans le ciel
 */
export function createLightning(
	conditions: WorldConditions,
	animationOffset: number = 0
): Element[] {
	const { weather, weatherIntensity } = conditions;

	if (weather !== "storm") {
		return [];
	}

	const elements: Element[] = [];
	const cloudBottom = getCloudBottomY(conditions);

	// Durée du cycle basée sur l'intensité
	// Note: avec 30 FPS et offset += 0.5, 1 seconde = ~15 unités
	// Orage léger: ~8 secondes entre les éclairs
	// Orage modéré: ~5 secondes
	// Orage violent: ~3 secondes
	const cycleLengths: Record<string, number> = {
		light: 120, // ~8 secondes
		moderate: 75, // ~5 secondes
		heavy: 45, // ~3 secondes
	};
	const cycleLength = cycleLengths[weatherIntensity] || 75;

	// Position dans le cycle actuel
	const cyclePosition = animationOffset % cycleLength;

	// Phases d'un éclair :
	// 0-3: Flash initial (écran blanc)
	// 3-8: Éclair principal visible
	// 8-12: Flash secondaire (rebond)
	// 12-18: Éclair secondaire visible
	// 18+: Pause

	const isFlashPhase1 = cyclePosition >= 0 && cyclePosition < 3;
	const isLightningPhase1 = cyclePosition >= 3 && cyclePosition < 10;
	const isFlashPhase2 = cyclePosition >= 10 && cyclePosition < 13;
	const isLightningPhase2 = cyclePosition >= 13 && cyclePosition < 18;

	// Seed basé sur le cycle pour avoir le même éclair pendant toute sa durée
	const cycleSeed = Math.floor(animationOffset / cycleLength);
	const random = seededRandom(cycleSeed * 12345);

	// Position X de l'éclair principal (évite les bords)
	const lightningX = 100 + random() * (CANVAS_WIDTH - 200);

	// Flash lumineux subtil (uniquement dans le ciel)
	if (isFlashPhase1) {
		// Flash dans le ciel uniquement
		elements.push(rectangle(0, 0, CANVAS_WIDTH, HORIZON_Y, { r: 245, g: 245, b: 255 }));
	} else if (isFlashPhase2) {
		// Flash plus faible (rebond) - encore plus subtil
		elements.push(rectangle(0, 0, CANVAS_WIDTH, cloudBottom + 30, { r: 235, g: 235, b: 250 }));
	}

	// Couleurs de l'éclair
	const coreColor = { r: 255, g: 255, b: 255 }; // Blanc pur au centre
	const glowColor = { r: 200, g: 200, b: 255 }; // Bleuté autour
	const outerGlow = { r: 150, g: 150, b: 220 }; // Halo externe

	// Génère l'éclair principal (reste dans le ciel)
	if (isLightningPhase1 || isLightningPhase2) {
		// Point de départ depuis les nuages
		const startY = cloudBottom - 5;
		// L'éclair s'arrête AVANT l'horizon (reste dans le ciel)
		// Hauteur limitée : entre 60 et 100 pixels
		const maxHeight = Math.min(80 + random() * 40, HORIZON_Y - startY - 20);
		const endY = startY + maxHeight;

		// Génère le chemin principal
		const mainPath = generateLightningPath(lightningX, startY, endY, random);

		// Halo externe (plus fin pour un look plus subtil)
		elements.push(...pathToElements(mainPath, 8, outerGlow));

		// Lueur intermédiaire
		elements.push(...pathToElements(mainPath, 5, glowColor));

		// Cœur de l'éclair (blanc brillant)
		elements.push(...pathToElements(mainPath, 2, coreColor));

		// Branches secondaires (plus courtes et moins nombreuses)
		if (isLightningPhase1) {
			const numBranches = 1 + Math.floor(random() * 2); // 1-2 branches max

			for (let b = 0; b < numBranches; b++) {
				// Point de départ sur le chemin principal (première moitié)
				const branchPointIndex = 1 + Math.floor(random() * Math.min(3, mainPath.length - 2));
				const branchStart = mainPath[branchPointIndex];

				// Direction et longueur (branches plus courtes)
				const direction = random() > 0.5 ? 1 : -1;
				const length = 20 + random() * 30;

				const branchPath = generateBranch(
					branchStart.x,
					branchStart.y,
					direction,
					length,
					random
				);

				// Dessine la branche (plus fine)
				elements.push(...pathToElements(branchPath, 4, outerGlow));
				elements.push(...pathToElements(branchPath, 2, glowColor));
				elements.push(...pathToElements(branchPath, 1, coreColor));
			}
		}
	}

	// Deuxième éclair (plus petit, décalé) pour les orages intenses
	if (weatherIntensity === "heavy" && cyclePosition >= 25 && cyclePosition < 35) {
		const random2 = seededRandom(cycleSeed * 67890);
		const lightning2X = 80 + random2() * (CANVAS_WIDTH - 160);

		// Évite que le 2ème éclair soit trop proche du premier
		const distance = Math.abs(lightning2X - lightningX);
		if (distance > 150) {
			const startY = cloudBottom - 5;
			// Éclair secondaire encore plus court
			const maxHeight2 = Math.min(50 + random2() * 30, HORIZON_Y - startY - 30);
			const endY = startY + maxHeight2;

			const path2 = generateLightningPath(lightning2X, startY, endY, random2);

			elements.push(...pathToElements(path2, 6, outerGlow));
			elements.push(...pathToElements(path2, 3, glowColor));
			elements.push(...pathToElements(path2, 1, coreColor));
		}
	}

	return elements;
}
