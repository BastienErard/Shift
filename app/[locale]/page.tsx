import { useTranslations } from "next-intl";
import ShiftScene from "@/components/ShiftScene";

export default function Home() {
	const t = useTranslations("home");
	const tSim = useTranslations("simulation");

	const translations = {
		simulation: {
			title: tSim("title"),
			mode: {
				live: tSim("mode.live"),
				manual: tSim("mode.manual"),
			},
			location: tSim("location"),
			myLocation: tSim("myLocation"),
			cloudCover: tSim("cloudCover"), // 🆕
			timeOfDay: {
				label: tSim("timeOfDay.label"),
				dawn: tSim("timeOfDay.dawn"),
				morning: tSim("timeOfDay.morning"),
				noon: tSim("timeOfDay.noon"),
				afternoon: tSim("timeOfDay.afternoon"),
				dusk: tSim("timeOfDay.dusk"),
				night: tSim("timeOfDay.night"),
			},
			season: {
				label: tSim("season.label"),
				spring: tSim("season.spring"),
				summer: tSim("season.summer"),
				autumn: tSim("season.autumn"),
				winter: tSim("season.winter"),
			},
			weather: {
				label: tSim("weather.label"),
				clear: tSim("weather.clear"),
				cloudy: tSim("weather.cloudy"),
				rain: tSim("weather.rain"),
				snow: tSim("weather.snow"),
				storm: tSim("weather.storm"),
			},
			temperature: {
				label: tSim("temperature.label"),
			},
			wind: {
				// 🆕 Toute la section
				label: tSim("wind.label"),
				speed: tSim("wind.speed"),
				direction: tSim("wind.direction"),
				directions: {
					none: tSim("wind.directions.none"),
					left: tSim("wind.directions.left"),
					right: tSim("wind.directions.right"),
				},
			},
		},
	};

	return (
		<div className="w-full">
			{/* Hero Section */}
			<section className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-4 text-center">
				<h1 className="text-3xl sm:text-4xl font-bold mb-2 text-sky-600 dark:text-sky-400">
					{t("title")}
				</h1>
				<p className="text-base text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
					{t("subtitle")}
				</p>
			</section>

			{/* Canvas + Simulation Section */}
			<section className="py-6">
				<ShiftScene translations={translations} />
			</section>

			{/* Features Section */}
			<section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
		<div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-lg transition-all duration-200">
			<div className="flex items-center gap-3 mb-2">
				<span className="text-2xl">{emoji}</span>
				<h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
			</div>
			<p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
		</div>
	);
}
