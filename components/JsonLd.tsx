"use client";

interface JsonLdProps {
	locale: string;
}

export function JsonLd({ locale }: JsonLdProps) {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://shift.example.com";

	const isFrench = locale === "fr";

	// Données structurées pour l'application web
	const webApplicationSchema = {
		"@context": "https://schema.org",
		"@type": "WebApplication",
		name: "Shift",
		description: isFrench
			? "Une scène pixel art générative qui évolue avec la météo, l'heure et les saisons."
			: "A generative pixel art scene that evolves with weather, time and seasons.",
		url: `${baseUrl}/${locale}`,
		applicationCategory: "Entertainment",
		operatingSystem: "Any",
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "EUR",
		},
		inLanguage: locale,
		author: {
			"@type": "Person",
			name: "Shift Project",
		},
	};

	// Données structurées pour le site web
	const websiteSchema = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "Shift",
		url: baseUrl,
		description: isFrench
			? "Un monde pixel art évolutif"
			: "An evolving pixel art world",
		inLanguage: [locale],
		potentialAction: {
			"@type": "SearchAction",
			target: `${baseUrl}/${locale}`,
		},
	};

	// Données structurées pour le projet créatif
	const creativeWorkSchema = {
		"@context": "https://schema.org",
		"@type": "CreativeWork",
		name: "Shift",
		description: isFrench
			? "Projet créatif #5To35 - Une scène pixel art générative"
			: "Creative project #5To35 - A generative pixel art scene",
		url: `${baseUrl}/${locale}`,
		genre: "Pixel Art",
		keywords: isFrench
			? "pixel art, génératif, météo, saisons, animation"
			: "pixel art, generative, weather, seasons, animation",
		inLanguage: locale,
		isAccessibleForFree: true,
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(webApplicationSchema),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(websiteSchema),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(creativeWorkSchema),
				}}
			/>
		</>
	);
}
