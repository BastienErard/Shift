import { useTranslations } from "next-intl";
import ShiftScene from "@/components/ShiftScene";

export default function Home() {
	const t = useTranslations("home");
	const tScene = useTranslations("sceneSelector");

	const sceneTranslations = {
		title: tScene("title"),
		sunny: tScene("sunny"),
		night: tScene("night"),
		rainy: tScene("rainy"),
		snowy: tScene("snowy"),
	};

	return (
		<div className="w-full">
			{/* Hero Section */}
			<section className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center">
				<h1 className="text-4xl sm:text-5xl font-bold mb-4">
					<span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
						{t("title")}
					</span>
				</h1>
				<p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">{t("subtitle")}</p>
			</section>

			{/* Canvas Section */}
			<section className="py-8">
				<ShiftScene translations={sceneTranslations} />
			</section>

			{/* Features Section */}
			<section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
				<div className="grid sm:grid-cols-3 gap-6">
					<FeatureCard
						emoji="🌦️"
						title={t("features.weather.title")}
						description={t("features.weather.description")}
					/>
					<FeatureCard
						emoji="🌅"
						title={t("features.time.title")}
						description={t("features.time.description")}
					/>
					<FeatureCard
						emoji="🍂"
						title={t("features.seasons.title")}
						description={t("features.seasons.description")}
					/>
				</div>
			</section>
		</div>
	);
}

function FeatureCard({
	emoji,
	title,
	description,
}: {
	emoji: string;
	title: string;
	description: string;
}) {
	return (
		<div className="p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-lg transition-all duration-200">
			<div className="text-3xl mb-3">{emoji}</div>
			<h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
			<p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
		</div>
	);
}
