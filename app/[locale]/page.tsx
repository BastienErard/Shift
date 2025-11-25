import { useTranslations } from "next-intl";
import { PixelCanvas } from "@/components/canvas";

/* Page d'accueil de Shift */
export default function Home() {
	const t = useTranslations("home");

	return (
		<main className="min-h-screen p-8 flex flex-col items-center">
			{/* En-tête */}
			<header className="text-center mb-8">
				<h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
				<p className="text-lg text-gray-600 dark:text-gray-400 max-w-md">{t("subtitle")}</p>
			</header>

			{/* Canvas pixel art */}
			<section className="mb-8">
				<PixelCanvas mode="test" testPreset="sunny" />
			</section>

			{/* Sélecteur de scène (temporaire, pour tester) */}
			<SceneSelector />
		</main>
	);
}

/* Sélecteur de scène temporaire*/
function SceneSelector() {
	return (
		<section className="flex flex-col items-center gap-4">
			<p className="text-sm text-gray-500 dark:text-gray-400">Test des scènes (temporaire)</p>
			<div className="flex gap-2 flex-wrap justify-center">
				<SceneButton preset="sunny" label="☀️ Ensoleillé" />
				<SceneButton preset="night" label="🌙 Nuit" />
				<SceneButton preset="rainy" label="🌧️ Pluvieux" />
				<SceneButton preset="snowy" label="❄️ Neigeux" />
			</div>
		</section>
	);
}

/* Bouton de sélection de scène */
function SceneButton({ preset, label }: { preset: string; label: string }) {
	return (
		<button
			className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg
					   hover:bg-gray-300 dark:hover:bg-gray-600
					   transition-colors text-sm"
			disabled
			title="Bientôt fonctionnel !"
		>
			{label}
		</button>
	);
}
