import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	// Remplacez par votre domaine réel après déploiement
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://shift.example.com";

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/api/", "/_next/"],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
