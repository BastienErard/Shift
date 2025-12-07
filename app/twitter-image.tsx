import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Shift - Paysage Pixel Art Génératif";
export const size = {
	width: 1200,
	height: 630,
};
export const contentType = "image/png";

// Réutilise le même design que opengraph-image
export { default } from "./opengraph-image";
