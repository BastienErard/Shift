import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
	// Langues disponibles dans l'application
	locales: ["fr", "en"],

	// Langue par défaut
	defaultLocale: "fr",

	// pas de préfixe si fr
	localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
