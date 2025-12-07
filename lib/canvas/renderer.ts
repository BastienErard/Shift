import type { Scene, Element, Color } from "./types";
import { colorToString } from "./types";

/**
 * Renderer Canvas pour Shift
 *
 * 🎓 Ordre de rendu :
 * 1. Ciel (fond)
 * 2. Éléments célestes (soleil, lune, étoiles, nuages)
 * 3. Sol (masque la partie basse du soleil à l'aube/crépuscule)
 * 4. Éléments terrestres (arbre, maison, météo)
 */

// Étend le type Element avec un z-index optionnel
type ElementWithZIndex = Element & { zIndex?: "sky" | "ground" };

export function renderScene(ctx: CanvasRenderingContext2D, scene: Scene): void {
	ctx.save();

	// Efface le canvas
	clearCanvas(ctx, scene);

	// Dessine le ciel uniquement
	drawSky(ctx, scene);

	// Dessine les éléments célestes (z-index = "sky")
	for (const element of scene.elements) {
		const el = element as ElementWithZIndex;
		if (el.zIndex === "sky") {
			drawElement(ctx, element);
		}
	}

	// Dessine le sol (masque la partie basse du soleil)
	drawGround(ctx, scene);

	// Dessine les éléments terrestres (pas de z-index ou z-index = "ground")
	for (const element of scene.elements) {
		const el = element as ElementWithZIndex;
		if (!el.zIndex || el.zIndex === "ground") {
			drawElement(ctx, element);
		}
	}

	ctx.restore();
}

/* Efface le canvas */
function clearCanvas(ctx: CanvasRenderingContext2D, scene: Scene): void {
	ctx.clearRect(0, 0, scene.dimensions.width, scene.dimensions.height);
}

/* Dessine le ciel (sans le sol) */
function drawSky(ctx: CanvasRenderingContext2D, scene: Scene): void {
	const { width, height } = scene.dimensions;

	// Ciel (toute la surface)
	ctx.fillStyle = colorToString(scene.skyColor);
	ctx.fillRect(0, 0, width, height);
}

/* Dessine le sol avec dégradé pour la zone de la forêt */
function drawGround(ctx: CanvasRenderingContext2D, scene: Scene): void {
	const { width, height } = scene.dimensions;

	// Sol (40% inférieur)
	const horizonY = height * 0.4;
	const groundHeight = height - horizonY;

	// Zone de la forêt (proche de l'horizon) : dégradé du ciel vers le sol
	// Cela évite l'effet "monobloc vert foncé" derrière les arbres
	const forestZoneHeight = groundHeight * 0.18; // 18% du sol = zone forêt

	// Créer un dégradé vertical du ciel vers le sol pour la zone forêt
	const gradient = ctx.createLinearGradient(0, horizonY, 0, horizonY + forestZoneHeight);
	gradient.addColorStop(0, colorToString(scene.skyColor)); // Commence avec la couleur du ciel
	gradient.addColorStop(0.4, colorToString(blendColors(scene.skyColor, scene.groundColor, 0.3))); // Transition
	gradient.addColorStop(1, colorToString(scene.groundColor)); // Termine avec la couleur du sol

	// Dessine la zone de dégradé (forêt)
	ctx.fillStyle = gradient;
	ctx.fillRect(0, horizonY, width, forestZoneHeight);

	// Dessine le reste du sol (couleur unie)
	ctx.fillStyle = colorToString(scene.groundColor);
	ctx.fillRect(0, horizonY + forestZoneHeight, width, groundHeight - forestZoneHeight);
}

/* Mélange deux couleurs */
function blendColors(color1: Color, color2: Color, ratio: number): Color {
	return {
		r: Math.round(color1.r * (1 - ratio) + color2.r * ratio),
		g: Math.round(color1.g * (1 - ratio) + color2.g * ratio),
		b: Math.round(color1.b * (1 - ratio) + color2.b * ratio),
	};
}

/* Dessine un élément selon son type */
function drawElement(ctx: CanvasRenderingContext2D, element: Element): void {
	switch (element.type) {
		case "rectangle":
			drawRectangle(ctx, element);
			break;

		case "circle":
			drawCircle(ctx, element);
			break;

		case "pixelGrid":
			drawPixelGrid(ctx, element);
			break;

		default:
			const exhaustiveCheck: never = element;
			console.warn("Type d'élément non géré:", exhaustiveCheck);
	}
}

/* Dessine un rectangle */
function drawRectangle(
	ctx: CanvasRenderingContext2D,
	rect: Extract<Element, { type: "rectangle" }>
): void {
	ctx.fillStyle = colorToString(rect.color);
	ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
}

/* Dessine un cercle */
function drawCircle(
	ctx: CanvasRenderingContext2D,
	circ: Extract<Element, { type: "circle" }>
): void {
	ctx.fillStyle = colorToString(circ.color);
	ctx.beginPath();
	ctx.arc(circ.x, circ.y, circ.radius, 0, Math.PI * 2);
	ctx.fill();
}

/* Dessine une grille de pixels */
function drawPixelGrid(
	ctx: CanvasRenderingContext2D,
	grid: Extract<Element, { type: "pixelGrid" }>
): void {
	ctx.fillStyle = colorToString(grid.color);

	for (let row = 0; row < grid.pixels.length; row++) {
		const rowData = grid.pixels[row];

		for (let col = 0; col < rowData.length; col++) {
			if (rowData[col]) {
				const pixelX = grid.x + col * grid.pixelSize;
				const pixelY = grid.y + row * grid.pixelSize;
				ctx.fillRect(pixelX, pixelY, grid.pixelSize, grid.pixelSize);
			}
		}
	}
}

/* Remplit le canvas avec une couleur unie */
export function fillCanvas(
	ctx: CanvasRenderingContext2D,
	color: Color,
	width: number,
	height: number
): void {
	ctx.fillStyle = colorToString(color);
	ctx.fillRect(0, 0, width, height);
}

/* Dessine du texte centré */
export function drawText(
	ctx: CanvasRenderingContext2D,
	text: string,
	x: number,
	y: number,
	color: Color,
	fontSize: number = 16
): void {
	ctx.fillStyle = colorToString(color);
	ctx.font = `${fontSize}px monospace`;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(text, x, y);
}
