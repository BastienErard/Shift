// ============================================================================
// CONSTANTES CANVAS (avec support Retina)
// ============================================================================

/* Dimensions AFFICHÉES (CSS pixels) */
export const DISPLAY_WIDTH = 400;
export const DISPLAY_HEIGHT = 300;

/* Ratio de pixels pour écrans haute résolution */
export const PIXEL_RATIO = 2;

/* Dimensions RÉELLES du canvas (pixels physiques) */
export const CANVAS_WIDTH = DISPLAY_WIDTH * PIXEL_RATIO;
export const CANVAS_HEIGHT = DISPLAY_HEIGHT * PIXEL_RATIO;

/* Position de l'horizon (ligne sol/ciel) */
export const HORIZON_Y = Math.floor(CANVAS_HEIGHT * 0.4);

// ============================================================================
// TYPES DE BASE
// ============================================================================

/* Couleur RGB */
export interface Color {
	r: number;
	g: number;
	b: number;
}

/* Position 2D */
export interface Position {
	x: number;
	y: number;
}

/* Dimensions 2D */
export interface Size {
	width: number;
	height: number;
}

// ============================================================================
// TYPES DE FORMES
// ============================================================================

/**
 * Z-index pour l'ordre de rendu
 * - "sky" : Éléments célestes (dessinés avant le sol)
 * - "ground" : Éléments terrestres (dessinés après le sol)
 */
export type ZIndex = "sky" | "ground";

/* Rectangle */
export interface RectangleShape {
	type: "rectangle";
	x: number;
	y: number;
	width: number;
	height: number;
	color: Color;
	zIndex?: ZIndex;
}

/* Cercle */
export interface CircleShape {
	type: "circle";
	x: number;
	y: number;
	radius: number;
	color: Color;
	zIndex?: ZIndex;
}

/* Grille de pixels */
export interface PixelGridShape {
	type: "pixelGrid";
	x: number;
	y: number;
	pixelSize: number;
	pixels: boolean[][];
	color: Color;
	zIndex?: ZIndex;
}

/* Union de toutes les formes possibles */
export type Element = RectangleShape | CircleShape | PixelGridShape;

// ============================================================================
// SCÈNE
// ============================================================================

/* Configuration complète d'une scène */
export interface Scene {
	dimensions: Size;
	skyColor: Color;
	groundColor: Color;
	elements: Element[];
}

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/* Crée une couleur RGB */
export function rgb(r: number, g: number, b: number): Color {
	return { r, g, b };
}

/* Convertit une Color en string CSS */
export function colorToString(color: Color): string {
	return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

/* Crée un rectangle */
export function rectangle(
	x: number,
	y: number,
	width: number,
	height: number,
	color: Color,
	zIndex?: ZIndex
): RectangleShape {
	return { type: "rectangle", x, y, width, height, color, zIndex };
}

/* Crée un cercle */
export function circle(
	x: number,
	y: number,
	radius: number,
	color: Color,
	zIndex?: ZIndex
): CircleShape {
	return { type: "circle", x, y, radius, color, zIndex };
}

/* Crée une grille de pixels */
export function pixelGrid(
	x: number,
	y: number,
	pixelSize: number,
	pixels: boolean[][],
	color: Color,
	zIndex?: ZIndex
): PixelGridShape {
	return { type: "pixelGrid", x, y, pixelSize, pixels, color, zIndex };
}

/**
 * Interpole entre deux couleurs
 *
 * @param from Couleur de départ
 * @param to Couleur d'arrivée
 * @param t Progression (0 = from, 1 = to)
 */
export function lerpColor(from: Color, to: Color, t: number): Color {
	const clamped = Math.max(0, Math.min(1, t));

	return {
		r: Math.round(from.r + (to.r - from.r) * clamped),
		g: Math.round(from.g + (to.g - from.g) * clamped),
		b: Math.round(from.b + (to.b - from.b) * clamped),
	};
}
