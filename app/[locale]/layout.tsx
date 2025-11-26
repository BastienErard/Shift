import "@/app/globals.css";

import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Geist, Geist_Mono } from "next/font/google";
import { Header, Footer } from "@/components/layout";

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

	return {
		title: t("title"),
		description: t("description"),
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
			</body>
		</html>
	);
}
