"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PixelCanvas } from "@/components/canvas";

/* Types pour les presets de scène */
type ScenePreset = "sunny" | "night" | "rainy" | "snowy";

/* Configuration des boutons de scène */
const SCENE_PRESETS: { id: ScenePreset; emoji: string; labelKey: string }[] = [
	{ id: "sunny", emoji: "☀️", labelKey: "sunny" },
	{ id: "night", emoji: "🌙", labelKey: "night" },
	{ id: "rainy", emoji: "🌧️", labelKey: "rainy" },
	{ id: "snowy", emoji: "❄️", labelKey: "snowy" },
];

/* Composant ShiftScene */
export default function ShiftScene() {
	const t = useTranslations("sceneSelector");

	/* State : preset de scène actuellement sélectionné */
	const [selectedPreset, setSelectedPreset] = useState<ScenePreset>("sunny");

	return (
		<div className="flex flex-col items-center gap-6">
			{/* Canvas pixel art */}
			<PixelCanvas mode="test" testPreset={selectedPreset} />

			{/* Sélecteur de scène */}
			<section className="flex flex-col items-center gap-3">
				<p className="text-sm text-gray-500 dark:text-gray-400">{t("title")}</p>

				<div className="flex gap-2 flex-wrap justify-center">
					{SCENE_PRESETS.map((preset) => (
						<button
							key={preset.id}
							onClick={() => setSelectedPreset(preset.id)}
							className={`
								px-4 py-2 rounded-lg transition-all text-sm
								${
									selectedPreset === preset.id
										? "bg-blue-500 text-white shadow-md scale-105"
										: "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
								}
							`}
							aria-pressed={selectedPreset === preset.id}
							aria-label={`${t(preset.labelKey)}`}
						>
							{preset.emoji} {t(preset.labelKey)}
						</button>
					))}
				</div>
			</section>
		</div>
	);
}
