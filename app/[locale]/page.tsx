import { useTranslations } from "next-intl";
import ShiftScene from "@/components/ShiftScene";

/* Page d'accueil de Shift*/
export default function Home() {
	const t = useTranslations("home");

	return (
		<main className="min-h-screen p-8 flex flex-col items-center">
			{/* En-tête */}
			<header className="text-center mb-8">
				<h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
				<p className="text-lg text-gray-600 dark:text-gray-400 max-w-md">{t("subtitle")}</p>
			</header>

			{/* Scène interactive (Client Component) */}
			<ShiftScene />
		</main>
	);
}
