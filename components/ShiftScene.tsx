"use client";

import { useState } from "react";
import { PixelCanvas } from "@/components/canvas";

type ScenePreset = "sunny" | "night" | "rainy" | "snowy";

interface ShiftSceneProps {
	translations: {
		title: string;
		sunny: string;
		night: string;
		rainy: string;
		snowy: string;
	};
}

const SCENE_PRESETS: {
	id: ScenePreset;
	emoji: string;
	labelKey: "sunny" | "night" | "rainy" | "snowy";
}[] = [
	{ id: "sunny", emoji: "☀️", labelKey: "sunny" },
	{ id: "night", emoji: "🌙", labelKey: "night" },
	{ id: "rainy", emoji: "🌧️", labelKey: "rainy" },
	{ id: "snowy", emoji: "❄️", labelKey: "snowy" },
];

export default function ShiftScene({ translations }: ShiftSceneProps) {
	const [selectedPreset, setSelectedPreset] = useState<ScenePreset>("sunny");

	return (
		<div className="flex flex-col items-center gap-6 w-full overflow-hidden">
			{/* Canvas */}
			<div className="w-full max-w-[400px] mx-auto">
				<div className="rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-200 dark:ring-gray-700">
					<PixelCanvas mode="test" testPreset={selectedPreset} />
				</div>
			</div>

			{/* Sélecteur */}
			<div className="flex flex-col items-center gap-3 w-full px-4">
				<p className="text-sm text-gray-500 dark:text-gray-400">{translations.title}</p>

				<div className="flex flex-wrap justify-center gap-2">
					{SCENE_PRESETS.map((preset) => (
						<button
							key={preset.id}
							onClick={() => setSelectedPreset(preset.id)}
							className={`
								flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
								transition-all duration-200 cursor-pointer
								${
									selectedPreset === preset.id
										? "bg-sky-500 text-white shadow-md"
										: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
								}
							`}
						>
							<span>{preset.emoji}</span>
							<span>{translations[preset.labelKey]}</span>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
