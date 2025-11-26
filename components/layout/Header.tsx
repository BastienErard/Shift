"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
	const pathname = usePathname();
	const params = useParams();
	const currentLocale = (params.locale as string) || "fr";
	const pathnameWithoutLocale = pathname.replace(/^\/(fr|en)/, "") || "/";

	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={`
				sticky top-0 z-50 w-full min-w-full transition-all duration-300
				border-b border-gray-200 dark:border-gray-800
				${
					scrolled
						? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm"
						: "bg-white dark:bg-gray-900"
				}
			`}
		>
			<nav className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between max-w-5xl mx-auto">
				{/* Titre */}
				<Link
					href={`/${currentLocale}`}
					className="text-xl font-bold text-gray-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
				>
					Shift
				</Link>

				{/* Actions */}
				<div className="flex items-center gap-4">
					<DarkModeToggle />
					<LanguageSelector currentLocale={currentLocale} pathname={pathnameWithoutLocale} />
				</div>
			</nav>
		</header>
	);
}

function DarkModeToggle() {
	const [isDark, setIsDark] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		// Lire depuis localStorage ET depuis la classe actuelle
		const savedTheme = localStorage.getItem("theme");
		const hasDarkClass = document.documentElement.classList.contains("dark");

		if (savedTheme === "dark" || (!savedTheme && hasDarkClass)) {
			setIsDark(true);
			document.documentElement.classList.add("dark");
		} else if (savedTheme === "light") {
			setIsDark(false);
			document.documentElement.classList.remove("dark");
		} else {
			// Pas de préférence, utiliser le système
			const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
			setIsDark(systemDark);
			if (systemDark) {
				document.documentElement.classList.add("dark");
			}
		}
	}, []);

	const toggleTheme = () => {
		const newIsDark = !isDark;
		setIsDark(newIsDark);

		if (newIsDark) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	};

	if (!mounted) {
		return <div className="w-6 h-6" />;
	}

	return (
		<button
			onClick={toggleTheme}
			className="p-2 text-gray-500 hover:text-amber-500 dark:text-gray-400 dark:hover:text-amber-400 transition-colors cursor-pointer"
			aria-label={isDark ? "Mode clair" : "Mode sombre"}
		>
			{isDark ? (
				<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
					<path
						fillRule="evenodd"
						d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
						clipRule="evenodd"
					/>
				</svg>
			) : (
				<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
					<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
				</svg>
			)}
		</button>
	);
}

function LanguageSelector({
	currentLocale,
	pathname,
}: {
	currentLocale: string;
	pathname: string;
}) {
	const locales = [
		{ code: "fr", label: "FR" },
		{ code: "en", label: "EN" },
	];

	return (
		<div className="flex rounded-full bg-gray-100 dark:bg-gray-800 p-1">
			{locales.map((locale) => {
				const isActive = currentLocale === locale.code;
				const href = `/${locale.code}${pathname === "/" ? "" : pathname}`;

				return (
					<Link
						key={locale.code}
						href={href}
						className={`
							px-4 py-1.5 text-sm font-medium rounded-full transition-all
							${
								isActive
									? "bg-sky-500 text-white"
									: "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
							}
						`}
					>
						{locale.label}
					</Link>
				);
			})}
		</div>
	);
}
