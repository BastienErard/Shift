import type { Element } from "../types";
import type { WorldConditions } from "../conditions";
import { rectangle } from "../types";
import { getRiverColors, SNOW_PALETTE } from "../palette";
import { CANVAS_WIDTH, CANVAS_HEIGHT, HORIZON_Y } from "../types";

/**
 * Crée la rivière qui traverse le premier plan
 * Position : horizontale, tout en bas du canvas
 */
export function createRiver(conditions: WorldConditions, animationOffset: number = 0): Element[] {
	const elements: Element[] = [];
	const colors = getRiverColors(conditions);

	// Position de la rivière (tout en bas, ne coupe pas la maison)
	const riverY = CANVAS_HEIGHT - 90; // Bien en bas du canvas
	const riverWidth = CANVAS_WIDTH;
	const riverHeight = 50;

	// ========================================
	// BERGE SUPÉRIEURE (nord)
	// ========================================

	// Bande de terre/boue
	elements.push(
		rectangle(0, riverY - 12, riverWidth, 14, colors.bank.mud)
	);

	// Rochers sur la berge nord
	const northRocks = [
		{ x: 60, w: 20, h: 10 },
		{ x: 180, w: 25, h: 12 },
		{ x: 350, w: 18, h: 9 },
		{ x: 500, w: 22, h: 11 },
		{ x: 650, w: 20, h: 10 },
	];

	for (const rock of northRocks) {
		// Ombre du rocher
		elements.push(
			rectangle(rock.x + 2, riverY - 8, rock.w, rock.h, colors.bank.rocksDark)
		);
		// Rocher
		elements.push(
			rectangle(rock.x, riverY - 10, rock.w, rock.h, colors.bank.rocks)
		);
		// Reflet
		elements.push(
			rectangle(rock.x + 2, riverY - 9, rock.w * 0.4, rock.h * 0.5, colors.bank.rocksLight)
		);
	}

	// ========================================
	// CORPS DE LA RIVIÈRE
	// ========================================

	if (colors.isFrozen) {
		// Rivière gelée
		createFrozenRiver(elements, colors, riverY, riverWidth, riverHeight);
	} else {
		// Rivière liquide
		createFlowingRiver(elements, colors, riverY, riverWidth, riverHeight, animationOffset);
	}

	// ========================================
	// BERGE INFÉRIEURE (sud)
	// ========================================

	// Bande de terre/boue
	elements.push(
		rectangle(0, riverY + riverHeight - 2, riverWidth, 14, colors.bank.mud)
	);

	// Rochers sur la berge sud
	const southRocks = [
		{ x: 30, w: 18, h: 9 },
		{ x: 140, w: 22, h: 11 },
		{ x: 280, w: 20, h: 10 },
		{ x: 420, w: 24, h: 12 },
		{ x: 580, w: 19, h: 10 },
		{ x: 720, w: 21, h: 11 },
	];

	for (const rock of southRocks) {
		elements.push(
			rectangle(rock.x + 2, riverY + riverHeight + 2, rock.w, rock.h, colors.bank.rocksDark)
		);
		elements.push(
			rectangle(rock.x, riverY + riverHeight, rock.w, rock.h, colors.bank.rocks)
		);
		elements.push(
			rectangle(rock.x + 2, riverY + riverHeight + 1, rock.w * 0.4, rock.h * 0.5, colors.bank.rocksLight)
		);
	}

	return elements;
}

/**
 * Crée une rivière qui coule (non gelée)
 */
function createFlowingRiver(
	elements: Element[],
	colors: ReturnType<typeof getRiverColors>,
	riverY: number,
	riverWidth: number,
	riverHeight: number,
	animationOffset: number
): void {
	// Fond de la rivière (eau profonde)
	elements.push(
		rectangle(0, riverY, riverWidth, riverHeight, colors.water.dark)
	);

	// Corps de l'eau
	elements.push(
		rectangle(0, riverY + 5, riverWidth, riverHeight - 10, colors.water.base)
	);

	// Reflets animés (se déplacent avec le temps)
	const reflectCount = 8;
	const reflectSpacing = riverWidth / reflectCount;

	for (let i = 0; i < reflectCount; i++) {
		// Position animée du reflet
		const baseX = i * reflectSpacing;
		const animatedX = (baseX + animationOffset * 0.5) % (riverWidth + 60) - 30;

		// Reflet principal
		elements.push(
			rectangle(
				animatedX,
				riverY + 12 + (i % 3) * 5,
				40 + (i % 2) * 15,
				6,
				colors.water.light
			)
		);
	}

	// Vagues / ondulations
	const waveCount = 12;
	const waveSpacing = riverWidth / waveCount;

	for (let i = 0; i < waveCount; i++) {
		const baseX = i * waveSpacing + 20;
		// Légère animation des vagues
		const waveY = riverY + 8 + Math.sin((i + animationOffset * 0.02) * 0.8) * 3;

		elements.push(
			rectangle(
				baseX,
				waveY,
				25 + (i % 3) * 8,
				3,
				colors.water.light
			)
		);
	}

	// Écume / mousse (petits points blancs)
	const foamPositions = [
		{ x: 80, y: 6 },
		{ x: 200, y: 10 },
		{ x: 320, y: 5 },
		{ x: 450, y: 12 },
		{ x: 580, y: 7 },
		{ x: 700, y: 9 },
	];

	for (const foam of foamPositions) {
		const animatedX = (foam.x + animationOffset * 0.3) % riverWidth;
		elements.push(
			rectangle(animatedX, riverY + foam.y, 12, 4, colors.water.foam)
		);
	}
}

/**
 * Crée une rivière gelée
 */
function createFrozenRiver(
	elements: Element[],
	colors: ReturnType<typeof getRiverColors>,
	riverY: number,
	riverWidth: number,
	riverHeight: number
): void {
	// Glace de base
	elements.push(
		rectangle(0, riverY, riverWidth, riverHeight, colors.ice.base)
	);

	// Reflets sur la glace
	const iceReflects = [
		{ x: 50, w: 80, h: 8 },
		{ x: 200, w: 100, h: 10 },
		{ x: 400, w: 90, h: 7 },
		{ x: 600, w: 85, h: 9 },
	];

	for (const reflect of iceReflects) {
		elements.push(
			rectangle(reflect.x, riverY + 8, reflect.w, reflect.h, colors.ice.light)
		);
	}

	// Fissures dans la glace
	const cracks = [
		{ x: 120, y: 15, w: 40, h: 2 },
		{ x: 125, y: 17, w: 2, h: 15 },
		{ x: 300, y: 10, w: 50, h: 2 },
		{ x: 320, y: 12, w: 2, h: 20 },
		{ x: 500, y: 18, w: 35, h: 2 },
		{ x: 510, y: 20, w: 2, h: 12 },
		{ x: 680, y: 12, w: 45, h: 2 },
	];

	for (const crack of cracks) {
		elements.push(
			rectangle(crack.x, riverY + crack.y, crack.w, crack.h, colors.ice.crack)
		);
	}

	// Neige sur la glace
	const snowPatches = [
		{ x: 30, w: 60, h: 12 },
		{ x: 180, w: 50, h: 10 },
		{ x: 350, w: 70, h: 14 },
		{ x: 520, w: 55, h: 11 },
		{ x: 700, w: 65, h: 13 },
	];

	for (const snow of snowPatches) {
		elements.push(
			rectangle(snow.x, riverY + 5, snow.w, snow.h, SNOW_PALETTE.base)
		);
	}
}

/**
 * Crée un petit pont en bois qui traverse la rivière du sud au nord
 * Le pont monte légèrement (perspective), planches perpendiculaires au sens de traversée
 */
export function createBridge(conditions: WorldConditions): Element[] {
	const elements: Element[] = [];
	const colors = getRiverColors(conditions);

	// Positions de la rivière
	const riverY = CANVAS_HEIGHT - 90;
	const riverHeight = 50;

	// Le pont va de la berge sud (bas) à la berge nord (haut)
	const bridgeX = CANVAS_WIDTH * 0.38;
	const bridgeWidth = 70; // Largeur du pont (horizontal sur l'écran)

	// Points d'ancrage : sud (bas) et nord (haut)
	const southY = riverY + riverHeight - 5; // Berge sud
	const northY = riverY - 5; // Berge nord
	const bridgeLength = southY - northY; // Longueur verticale du pont

	// Couleurs du pont (bois)
	const woodBase = { r: 120, g: 85, b: 50 };
	const woodLight = { r: 150, g: 110, b: 70 };
	const woodDark = { r: 85, g: 60, b: 35 };

	// ========================================
	// PILIERS (dans l'eau)
	// ========================================
	const pillarWidth = 8;
	const pillarDepth = 6;

	// Pilier sud (dans l'eau, côté bas)
	const pillarSouthY = riverY + riverHeight - 15;
	elements.push(
		rectangle(bridgeX + 10, pillarSouthY, pillarWidth, 20, woodDark)
	);
	elements.push(
		rectangle(bridgeX + bridgeWidth - 18, pillarSouthY, pillarWidth, 20, woodDark)
	);

	// Pilier nord (dans l'eau, côté haut)
	const pillarNorthY = riverY + 5;
	elements.push(
		rectangle(bridgeX + 10, pillarNorthY, pillarWidth, 25, woodDark)
	);
	elements.push(
		rectangle(bridgeX + bridgeWidth - 18, pillarNorthY, pillarWidth, 25, woodDark)
	);

	// ========================================
	// STRUCTURE DU PONT (longerons latéraux)
	// ========================================

	// Longeron gauche (poutre latérale)
	elements.push(
		rectangle(bridgeX, northY, 6, bridgeLength, woodDark)
	);
	elements.push(
		rectangle(bridgeX, northY, 3, bridgeLength, woodBase)
	);

	// Longeron droit
	elements.push(
		rectangle(bridgeX + bridgeWidth - 6, northY, 6, bridgeLength, woodDark)
	);
	elements.push(
		rectangle(bridgeX + bridgeWidth - 6, northY, 3, bridgeLength, woodBase)
	);

	// ========================================
	// PLANCHES (perpendiculaires au sens de traversée = horizontales)
	// ========================================
	const plankHeight = 5; // Épaisseur de chaque planche
	const plankSpacing = 6; // Espacement entre planches
	const numPlanks = Math.floor(bridgeLength / plankSpacing);

	for (let i = 0; i < numPlanks; i++) {
		const plankY = northY + i * plankSpacing + 2;

		// Planche principale
		elements.push(
			rectangle(bridgeX + 4, plankY, bridgeWidth - 8, plankHeight, woodBase)
		);

		// Détail : ligne sombre entre les planches
		elements.push(
			rectangle(bridgeX + 4, plankY + plankHeight - 1, bridgeWidth - 8, 1, woodDark)
		);

		// Variation de couleur alternée pour texture
		if (i % 2 === 0) {
			elements.push(
				rectangle(bridgeX + 6, plankY + 1, bridgeWidth - 12, plankHeight - 2, woodLight)
			);
		}
	}

	// ========================================
	// RAMBARDES (poteaux verticaux sur les côtés)
	// ========================================
	const railHeight = 18;
	const postWidth = 3;
	const postSpacing = 12;
	const numPosts = Math.floor(bridgeLength / postSpacing);

	// Poteaux côté gauche
	for (let i = 0; i <= numPosts; i++) {
		const postY = northY + i * postSpacing;
		elements.push(
			rectangle(bridgeX - 2, postY - railHeight, postWidth, railHeight + 3, woodBase)
		);
	}

	// Poteaux côté droit
	for (let i = 0; i <= numPosts; i++) {
		const postY = northY + i * postSpacing;
		elements.push(
			rectangle(bridgeX + bridgeWidth - 1, postY - railHeight, postWidth, railHeight + 3, woodBase)
		);
	}

	// Main courante gauche (barre horizontale le long du pont)
	elements.push(
		rectangle(bridgeX - 3, northY - railHeight, 4, bridgeLength, woodBase)
	);
	elements.push(
		rectangle(bridgeX - 3, northY - railHeight, 2, bridgeLength, woodLight)
	);

	// Main courante droite
	elements.push(
		rectangle(bridgeX + bridgeWidth - 1, northY - railHeight, 4, bridgeLength, woodBase)
	);
	elements.push(
		rectangle(bridgeX + bridgeWidth - 1, northY - railHeight, 2, bridgeLength, woodLight)
	);

	// ========================================
	// NEIGE (si gelé)
	// ========================================
	if (colors.isFrozen) {
		// Neige sur les planches
		for (let i = 0; i < numPlanks; i += 2) {
			const plankY = northY + i * plankSpacing;
			elements.push(
				rectangle(bridgeX + 8, plankY - 1, bridgeWidth - 16, 3, SNOW_PALETTE.base)
			);
		}
		// Neige sur les mains courantes
		elements.push(
			rectangle(bridgeX - 2, northY - railHeight - 2, 3, bridgeLength, SNOW_PALETTE.base)
		);
		elements.push(
			rectangle(bridgeX + bridgeWidth, northY - railHeight - 2, 3, bridgeLength, SNOW_PALETTE.base)
		);
	}

	return elements;
}
