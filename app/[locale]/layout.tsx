import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Geist, Geist_Mono } from "next/font/google";

/* Fonts Google optimisées par Next.js */
const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

/* Charge les métadonnées avant le rendu */
export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const messages = await getMessages({ locale });
	const metadata = messages.metadata as any;

	const baseUrl = "https://shift.bastienerard.dev"; // 👈 Remplace par ton URL Vercel

	return {
		metadataBase: new URL(baseUrl),

		title: {
			default: metadata.title,
			template: `%s | ${metadata.title}`,
		},
		description: metadata.description,
		keywords:
			locale === "fr"
				? [
						"pixel art",
						"art génératif",
						"météo temps réel",
						"scène évolutive",
						"next.js",
						"canvas",
						"typescript",
					]
				: [
						"pixel art",
						"generative art",
						"real-time weather",
						"evolving scene",
						"next.js",
						"canvas",
						"typescript",
					],
		authors: [{ name: "Bastien Erard" }],
		creator: "Bastien Erard",
		openGraph: {
			type: "website",
			locale: locale === "fr" ? "fr_CH" : "en_US",
			url: `${baseUrl}/${locale === "fr" ? "" : locale}`,
			title: metadata.title,
			description: metadata.description,
			siteName: "Shift",
			images: [
				{
					url: `/og-image-${locale}.png`,
					width: 1200,
					height: 630,
					alt: metadata.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: metadata.title,
			description: metadata.description,
			images: [`/og-image-${locale}.png`],
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
		alternates: {
			canonical: `${baseUrl}/${locale === "fr" ? "" : locale}`,
			languages: {
				"fr-CH": `${baseUrl}`,
				"en-US": `${baseUrl}/en`,
			},
		},
	};
}

/* Génère les chemins statiques pour chaque locale */
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

/* Layout principal pour chaque locale*/
export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	if (!routing.locales.includes(locale as any)) {
		notFound();
	}

	const messages = await getMessages();

	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			<div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</div>
		</NextIntlClientProvider>
	);
}
