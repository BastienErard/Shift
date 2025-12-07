import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Shift - Paysage Pixel Art Génératif",
		short_name: "Shift",
		description:
			"Une scène pixel art qui évolue en temps réel selon la météo, l'heure et les saisons",
		start_url: "/",
		display: "standalone",
		background_color: "#87CEEB",
		theme_color: "#0EA5E9",
		orientation: "any",
		icons: [
			{
				src: "/icon.svg",
				sizes: "any",
				type: "image/svg+xml",
			},
			{
				src: "/apple-icon",
				sizes: "180x180",
				type: "image/png",
			},
		],
	};
}
