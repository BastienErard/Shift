import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
	// Remplacez par votre domaine réel après déploiement
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://shift.example.com";

	// Génère les URLs pour chaque locale
	const localeUrls = routing.locales.map((locale) => ({
		url: `${baseUrl}/${locale}`,
		lastModified: new Date(),
		changeFrequency: "weekly" as const,
		priority: 1,
		alternates: {
			languages: Object.fromEntries(
				routing.locales.map((l) => [l, `${baseUrl}/${l}`])
			),
		},
	}));

	return [
		// Page d'accueil (redirige vers la locale par défaut)
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		// Pages localisées
		...localeUrls,
	];
}
