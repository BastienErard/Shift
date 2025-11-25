import type { Scene, Element, Color } from "./types";
import { colorToString, PIXEL_RATIO, DISPLAY_WIDTH, DISPLAY_HEIGHT } from "./types";

/* Renderer Canvas pour Shift */
export function renderScene(ctx: CanvasRenderingContext2D, scene: Scene): void {
	ctx.save();

	// Efface le canvas
	clearCanvas(ctx, scene);

	// Dessine le fond (ciel + sol)
	drawBackground(ctx, scene);

	// Dessine tous les éléments
	for (const element of scene.elements) {
		drawElement(ctx, element);
	}

	ctx.restore();
}

/* Efface le canvas */
function clearCanvas(ctx: CanvasRenderingContext2D, scene: Scene): void {
	ctx.clearRect(0, 0, scene.dimensions.width, scene.dimensions.height);
}

/* Dessine le fond (ciel + sol) */
function drawBackground(ctx: CanvasRenderingContext2D, scene: Scene): void {
	const { width, height } = scene.dimensions;

	// Ciel (toute la surface)
	ctx.fillStyle = colorToString(scene.skyColor);
	ctx.fillRect(0, 0, width, height);

	// Sol (40% inférieur)
	const horizonY = height * 0.4;
	ctx.fillStyle = colorToString(scene.groundColor);
	ctx.fillRect(0, horizonY, width, height - horizonY);
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
