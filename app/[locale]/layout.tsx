import "@/app/globals.css";

import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Geist, Geist_Mono } from "next/font/google";
import { Header, Footer } from "@/components/layout";
import { JsonLd } from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "metadata" });
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://shift.example.com";

	return {
		title: t("title"),
		description: t("description"),
		keywords: t("keywords"),
		authors: [{ name: "Shift Project" }],
		creator: "Shift Project",
		metadataBase: new URL(baseUrl),
		alternates: {
			canonical: `${baseUrl}/${locale}`,
			languages: {
				fr: `${baseUrl}/fr`,
				en: `${baseUrl}/en`,
			},
		},
		openGraph: {
			title: t("ogTitle"),
			description: t("ogDescription"),
			url: `${baseUrl}/${locale}`,
			siteName: "Shift",
			locale: locale === "fr" ? "fr_FR" : "en_US",
			alternateLocale: locale === "fr" ? "en_US" : "fr_FR",
			type: "website",
			images: [
				{
					url: `${baseUrl}/opengraph-image`,
					width: 1200,
					height: 630,
					alt: t("title"),
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: t("twitterTitle"),
			description: t("twitterDescription"),
			images: [`${baseUrl}/twitter-image`],
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
		verification: {
			// Ajoutez vos codes de vérification ici après configuration
			// google: "votre-code-google",
			// yandex: "votre-code-yandex",
		},
	};
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	if (!routing.locales.includes(locale as Locale)) {
		notFound();
	}

	const messages = await getMessages();

	return (
		<html lang={locale} suppressHydrationWarning className="w-full">
			<head>
				{/* Preconnect pour améliorer les performances */}
				<link rel="preconnect" href="https://api.open-meteo.com" />
				<link rel="dns-prefetch" href="https://api.open-meteo.com" />
				<script
					dangerouslySetInnerHTML={{
						__html: `
				(function() {
					function setTheme() {
						try {
							var savedTheme = localStorage.getItem('theme');
							if (savedTheme === 'dark') {
								document.documentElement.classList.add('dark');
							} else if (savedTheme === 'light') {
								document.documentElement.classList.remove('dark');
							} else {
								// Pas de préférence sauvegardée, utiliser le système
								if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
									document.documentElement.classList.add('dark');
								}
							}
						} catch (e) {}
					}
					setTheme();
					// Re-appliquer après hydratation React
					if (document.readyState === 'loading') {
						document.addEventListener('DOMContentLoaded', setTheme);
					}
				})();
			`,
					}}
				/>
				<JsonLd locale={locale} />
			</head>
			<body
				className={`
					${geistSans.variable} ${geistMono.variable}
					font-sans antialiased
					min-h-screen w-full overflow-x-hidden
					bg-white dark:bg-gray-900
					text-gray-900 dark:text-gray-100
				`}
			>
				<NextIntlClientProvider messages={messages}>
					<div className="flex flex-col min-h-screen w-full">
						<Header />
						<main className="flex-1 w-full">{children}</main>
						<Footer />
					</div>
				</NextIntlClientProvider>
				<Analytics />
			</body>
		</html>
	);
}
