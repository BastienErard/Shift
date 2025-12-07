import type { Element } from "../types";
import type { WorldConditions } from "../conditions";
import { rectangle } from "../types";
import { getTreeColors, darkenColor, SNOW_PALETTE } from "../palette";
import { CANVAS_WIDTH, HORIZON_Y } from "../types";
import { hasSnowOnGround } from "../conditions";

/**
 * Crée un arbre détaillé avec texture
 * @param conditions Les conditions actuelles
 * @param positionX Position X de l'arbre
 * @param scale Échelle de l'arbre (1.0 = taille normale)
 * @param positionY Position Y du pied de l'arbre (optionnel, par défaut sur le sol)
 */
export function createTree(
	conditions: WorldConditions,
	positionX?: number,
	scale: number = 1.0,
	positionY?: number
): Element[] {
	const colors = getTreeColors(conditions);
	const elements: Element[] = [];
	const isSnowy = hasSnowOnGround(conditions);

	/* Position de base de l'arbre */
	const baseX = positionX ?? Math.floor(CANVAS_WIDTH * 0.2);
	const baseY = positionY ?? HORIZON_Y + 80; // Pied du tronc sur le sol

	/* Dimensions de l'arbre (ajustées par scale) */
	const dimensions = {
		trunk: { width: 20 * scale, height: 80 * scale },
		foliage: {
			top: { width: 40 * scale, height: 25 * scale },
			middle: { width: 65 * scale, height: 30 * scale },
			bottom: { width: 90 * scale, height: 35 * scale },
		},
	};

	// ========================================
	// TRONC AVEC TEXTURE
	// ========================================

	const trunkX = baseX - dimensions.trunk.width / 2;
	const trunkY = baseY - dimensions.trunk.height;

	// Ombre du tronc (côté droit)
	elements.push(
		rectangle(
			trunkX + dimensions.trunk.width * 0.6,
			trunkY,
			dimensions.trunk.width * 0.4,
			dimensions.trunk.height,
			colors.trunkDark
		)
	);

	// Corps du tronc
	elements.push(
		rectangle(trunkX, trunkY, dimensions.trunk.width * 0.7, dimensions.trunk.height, colors.trunk)
	);

	// Reflet du tronc (côté gauche)
	elements.push(
		rectangle(
			trunkX,
			trunkY,
			dimensions.trunk.width * 0.25,
			dimensions.trunk.height,
			colors.trunkLight
		)
	);

	// Détails d'écorce (lignes horizontales)
	const barkLines = [0.2, 0.4, 0.6, 0.8];
	for (const ratio of barkLines) {
		elements.push(
			rectangle(
				trunkX + 2,
				trunkY + dimensions.trunk.height * ratio,
				dimensions.trunk.width * 0.6,
				2 * scale,
				colors.trunkDark
			)
		);
	}

	// ========================================
	// FEUILLAGE AVEC TEXTURE
	// ========================================

	// Couche basse (la plus large) - avec ombres
	const bottomY = trunkY - dimensions.foliage.bottom.height + 20 * scale;
	const bottomX = baseX - dimensions.foliage.bottom.width / 2;

	// Ombre de la couche basse
	elements.push(
		rectangle(
			bottomX + dimensions.foliage.bottom.width * 0.1,
			bottomY + dimensions.foliage.bottom.height * 0.5,
			dimensions.foliage.bottom.width * 0.8,
			dimensions.foliage.bottom.height * 0.5,
			colors.shadow
		)
	);

	// Corps couche basse
	elements.push(
		rectangle(bottomX, bottomY, dimensions.foliage.bottom.width, dimensions.foliage.bottom.height, colors.foliage[0])
	);

	// Couche milieu
	const middleY = bottomY - dimensions.foliage.middle.height + 12 * scale;
	const middleX = baseX - dimensions.foliage.middle.width / 2;

	// Ombre couche milieu
	elements.push(
		rectangle(
			middleX + dimensions.foliage.middle.width * 0.15,
			middleY + dimensions.foliage.middle.height * 0.55,
			dimensions.foliage.middle.width * 0.7,
			dimensions.foliage.middle.height * 0.45,
			colors.shadow
		)
	);

	// Corps couche milieu
	elements.push(
		rectangle(middleX, middleY, dimensions.foliage.middle.width, dimensions.foliage.middle.height, colors.foliage[1])
	);

	// Couche haute (sommet)
	const topY = middleY - dimensions.foliage.top.height + 10 * scale;
	const topX = baseX - dimensions.foliage.top.width / 2;

	// Corps couche haute
	elements.push(
		rectangle(topX, topY, dimensions.foliage.top.width, dimensions.foliage.top.height, colors.foliage[2])
	);

	// Reflets (highlights)
	elements.push(
		rectangle(
			topX + dimensions.foliage.top.width * 0.2,
			topY + 3 * scale,
			dimensions.foliage.top.width * 0.4,
			dimensions.foliage.top.height * 0.4,
			colors.highlight
		)
	);

	elements.push(
		rectangle(
			middleX + dimensions.foliage.middle.width * 0.1,
			middleY + 4 * scale,
			dimensions.foliage.middle.width * 0.3,
			dimensions.foliage.middle.height * 0.35,
			colors.highlight
		)
	);

	// Neige sur les branches si hiver
	if (isSnowy) {
		// Neige sur couche haute
		elements.push(
			rectangle(
				topX + 2 * scale,
				topY - 3 * scale,
				dimensions.foliage.top.width * 0.8,
				8 * scale,
				SNOW_PALETTE.base
			)
		);
		// Neige sur couche milieu
		elements.push(
			rectangle(
				middleX + 5 * scale,
				middleY - 2 * scale,
				dimensions.foliage.middle.width * 0.6,
				6 * scale,
				SNOW_PALETTE.base
			)
		);
		// Neige sur couche basse
		elements.push(
			rectangle(
				bottomX + 8 * scale,
				bottomY - 2 * scale,
				dimensions.foliage.bottom.width * 0.5,
				5 * scale,
				SNOW_PALETTE.base
			)
		);
	}

	return elements;
}

/**
 * Crée un arbre d'arrière-plan (simplifié, forme de sapin/conifère)
 * Variantes de forme pour éviter l'effet "haie"
 */
export function createBackgroundTree(
	conditions: WorldConditions,
	positionX: number,
	depth: number, // 0 = proche, 1 = milieu, 2 = loin
	variant: number = 0 // Variante de forme (0-2)
): Element[] {
	const colors = getTreeColors(conditions);
	const elements: Element[] = [];
	const isSnowy = hasSnowOnGround(conditions);

	// Plus l'arbre est loin, plus il est petit et foncé
	// Augmentation significative du contraste entre les plans
	const depthScales = [0.9, 0.6, 0.4];
	const depthDarkness = [0.95, 0.65, 0.4]; // Plus de contraste entre les plans

	// Variation de taille pseudo-aléatoire basée sur la position
	const sizeVariation = 0.75 + (((positionX * 7) % 100) / 100) * 0.5; // 0.75 à 1.25
	const scale = depthScales[depth] * sizeVariation;
	const darkness = depthDarkness[depth];

	// Position Y selon la profondeur avec variation plus prononcée
	const depthYOffsets = [65, 40, 20];
	const yVariation = ((positionX * 17) % 25) - 12; // -12 à +13
	const baseY = HORIZON_Y + depthYOffsets[depth] + yVariation;

	// Dimensions du tronc
	const trunkWidth = 5 * scale;
	const trunkHeight = 18 * scale;

	const trunkX = positionX - trunkWidth / 2;
	const trunkY = baseY - trunkHeight;

	// Tronc (seulement visible sur plan proche)
	if (depth === 0) {
		const trunkColor = darkenColor(colors.trunk, darkness);
		elements.push(rectangle(trunkX, trunkY, trunkWidth, trunkHeight, trunkColor));
	}

	// Couleurs du feuillage avec effet de profondeur atmosphérique
	// Les arbres lointains sont plus bleutés/grisés (effet atmosphérique)
	const atmosphereBlend = depth === 2 ? 0.3 : depth === 1 ? 0.15 : 0;
	const atmosphereColor = { r: 150, g: 170, b: 190 }; // Bleu-gris atmosphérique

	const blendWithAtmosphere = (color: { r: number; g: number; b: number }) => {
		if (atmosphereBlend === 0) return darkenColor(color, darkness);
		const darkened = darkenColor(color, darkness);
		return {
			r: Math.round(darkened.r * (1 - atmosphereBlend) + atmosphereColor.r * atmosphereBlend),
			g: Math.round(darkened.g * (1 - atmosphereBlend) + atmosphereColor.g * atmosphereBlend),
			b: Math.round(darkened.b * (1 - atmosphereBlend) + atmosphereColor.b * atmosphereBlend),
		};
	};

	const foliageBase = blendWithAtmosphere(colors.foliage[0]);
	const foliageMid = blendWithAtmosphere(colors.foliage[1]);
	const foliageTop = blendWithAtmosphere(colors.foliage[2]);

	// Différentes formes selon la variante
	const treeVariant = variant % 3;

	if (treeVariant === 0) {
		// Sapin classique (forme triangulaire en 3 étages)
		const layer1Width = 28 * scale;
		const layer1Height = 14 * scale;
		const layer2Width = 20 * scale;
		const layer2Height = 12 * scale;
		const layer3Width = 12 * scale;
		const layer3Height = 10 * scale;

		// Étage du bas
		elements.push(
			rectangle(positionX - layer1Width / 2, trunkY - layer1Height + 5 * scale, layer1Width, layer1Height, foliageBase)
		);
		// Étage milieu
		elements.push(
			rectangle(positionX - layer2Width / 2, trunkY - layer1Height - layer2Height + 10 * scale, layer2Width, layer2Height, foliageMid)
		);
		// Sommet
		elements.push(
			rectangle(positionX - layer3Width / 2, trunkY - layer1Height - layer2Height - layer3Height + 16 * scale, layer3Width, layer3Height, foliageTop)
		);

		// Neige sur le sommet (plans proches uniquement)
		if (isSnowy && depth === 0) {
			const snowColor = darkenColor(SNOW_PALETTE.base, darkness + 0.1);
			elements.push(
				rectangle(positionX - layer3Width / 2 + 1, trunkY - layer1Height - layer2Height - layer3Height + 14 * scale, layer3Width - 2, 3 * scale, snowColor)
			);
		}
	} else if (treeVariant === 1) {
		// Sapin élancé (plus haut et fin, style épicéa)
		const width = 16 * scale;
		const totalHeight = 38 * scale;

		elements.push(
			rectangle(positionX - width / 2, trunkY - totalHeight * 0.4, width, totalHeight * 0.35, foliageBase)
		);
		elements.push(
			rectangle(positionX - width * 0.65 / 2, trunkY - totalHeight * 0.7, width * 0.65, totalHeight * 0.3, foliageMid)
		);
		elements.push(
			rectangle(positionX - width * 0.35 / 2, trunkY - totalHeight * 0.95, width * 0.35, totalHeight * 0.25, foliageTop)
		);

		if (isSnowy && depth === 0) {
			const snowColor = darkenColor(SNOW_PALETTE.base, darkness + 0.1);
			elements.push(rectangle(positionX - width * 0.25 / 2, trunkY - totalHeight - 2 * scale, width * 0.3, 2 * scale, snowColor));
		}
	} else {
		// Arbre feuillu/rond (style chêne)
		const crownWidth = 26 * scale;
		const crownHeight = 22 * scale;

		// Ombre (base)
		elements.push(
			rectangle(positionX - crownWidth * 0.45 / 2, trunkY - crownHeight + 10 * scale, crownWidth * 0.9, crownHeight * 0.45, darkenColor(foliageBase, 0.85))
		);
		// Corps principal
		elements.push(
			rectangle(positionX - crownWidth / 2, trunkY - crownHeight + 4 * scale, crownWidth, crownHeight * 0.65, foliageBase)
		);
		// Partie haute
		elements.push(
			rectangle(positionX - crownWidth * 0.65 / 2, trunkY - crownHeight - 2 * scale, crownWidth * 0.65, crownHeight * 0.35, foliageMid)
		);
		// Reflet/sommet
		if (depth === 0) {
			elements.push(
				rectangle(positionX - crownWidth * 0.3 / 2, trunkY - crownHeight - 1 * scale, crownWidth * 0.3, crownHeight * 0.2, foliageTop)
			);
		}

		if (isSnowy && depth === 0) {
			const snowColor = darkenColor(SNOW_PALETTE.base, darkness + 0.1);
			elements.push(rectangle(positionX - crownWidth * 0.45 / 2, trunkY - crownHeight - 3 * scale, crownWidth * 0.45, 3 * scale, snowColor));
		}
	}

	return elements;
}

/**
 * Crée la forêt en arrière-plan avec plusieurs plans
 * Les arbres sont variés en forme et taille pour éviter l'effet "haie"
 */
export function createForest(conditions: WorldConditions): Element[] {
	const elements: Element[] = [];

	// Plan lointain (profondeur 2) - silhouettes espacées irrégulièrement
	const farTrees = [
		{ x: 25, v: 0 }, { x: 75, v: 1 }, { x: 130, v: 2 }, { x: 185, v: 0 },
		{ x: 250, v: 1 }, { x: 310, v: 2 }, { x: 375, v: 0 }, { x: 430, v: 1 },
		{ x: 495, v: 2 }, { x: 555, v: 0 }, { x: 620, v: 1 }, { x: 685, v: 2 },
		{ x: 750, v: 0 },
	];
	for (const tree of farTrees) {
		elements.push(...createBackgroundTree(conditions, tree.x, 2, tree.v));
	}

	// Plan moyen (profondeur 1) - espacement irrégulier, variantes alternées
	const midTrees = [
		{ x: 45, v: 1 }, { x: 115, v: 2 }, { x: 195, v: 0 }, { x: 285, v: 1 },
		{ x: 380, v: 2 }, { x: 475, v: 0 }, { x: 570, v: 1 }, { x: 670, v: 2 },
		{ x: 760, v: 0 },
	];
	for (const tree of midTrees) {
		elements.push(...createBackgroundTree(conditions, tree.x, 1, tree.v));
	}

	// Plan proche (profondeur 0) - moins d'arbres mais plus détaillés
	// Éviter les zones où se trouve la maison (environ x=336 à x=476)
	const nearTrees = [
		{ x: 65, v: 0 }, { x: 160, v: 2 }, { x: 255, v: 1 },
		{ x: 530, v: 0 }, { x: 630, v: 2 }, { x: 740, v: 1 },
	];
	for (const tree of nearTrees) {
		elements.push(...createBackgroundTree(conditions, tree.x, 0, tree.v));
	}

	return elements;
}

/**
 * Crée plusieurs arbres à différentes positions (API existante conservée)
 */
export function createTrees(conditions: WorldConditions, positions: number[]): Element[] {
	const elements: Element[] = [];

	for (const posX of positions) {
		elements.push(...createTree(conditions, posX));
	}

	return elements;
}

/**
 * Crée un petit buisson
 */
export function createBush(
	conditions: WorldConditions,
	positionX: number,
	positionY?: number,
	scale: number = 1.0
): Element[] {
	const colors = getTreeColors(conditions);
	const elements: Element[] = [];
	const isSnowy = hasSnowOnGround(conditions);

	const baseX = positionX;
	const baseY = positionY ?? HORIZON_Y + 95;

	// Le buisson est fait de 3 rectangles qui se chevauchent
	const bushColor = colors.foliage[0];
	const bushDark = colors.shadow;
	const bushLight = colors.highlight;

	// Ombre
	elements.push(
		rectangle(baseX - 18 * scale, baseY - 10 * scale, 36 * scale, 14 * scale, bushDark)
	);

	// Rectangle central (le plus grand)
	elements.push(
		rectangle(baseX - 20 * scale, baseY - 18 * scale, 40 * scale, 22 * scale, bushColor)
	);

	// Rectangle gauche
	elements.push(
		rectangle(baseX - 28 * scale, baseY - 12 * scale, 20 * scale, 16 * scale, colors.foliage[1])
	);

	// Rectangle droit
	elements.push(
		rectangle(baseX + 10 * scale, baseY - 14 * scale, 22 * scale, 18 * scale, colors.foliage[2])
	);

	// Reflet
	elements.push(
		rectangle(baseX - 15 * scale, baseY - 16 * scale, 12 * scale, 8 * scale, bushLight)
	);

	// Neige sur le buisson
	if (isSnowy) {
		elements.push(
			rectangle(baseX - 15 * scale, baseY - 20 * scale, 30 * scale, 5 * scale, SNOW_PALETTE.base)
		);
	}

	return elements;
}

/**
 * Crée plusieurs buissons décoratifs
 */
export function createBushes(conditions: WorldConditions): Element[] {
	const elements: Element[] = [];

	// Positions des buissons
	const bushPositions = [
		{ x: 80, y: HORIZON_Y + 100, scale: 0.8 },
		{ x: 250, y: HORIZON_Y + 110, scale: 1.0 },
		{ x: 580, y: HORIZON_Y + 105, scale: 0.9 },
		{ x: 720, y: HORIZON_Y + 95, scale: 0.7 },
	];

	for (const pos of bushPositions) {
		elements.push(...createBush(conditions, pos.x, pos.y, pos.scale));
	}

	return elements;
}
