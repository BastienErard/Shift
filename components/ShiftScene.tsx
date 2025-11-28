"use client";

import { useState } from "react";
import { PixelCanvas } from "@/components/canvas";
import type { WorldConditions, TimeOfDay, Season, Weather } from "@/lib/canvas/conditions";

interface ShiftSceneProps {
	translations: {
		simulation: {
			title: string;
			timeOfDay: {
				label: string;
				dawn: string;
				morning: string;
				noon: string;
				afternoon: string;
				dusk: string;
				night: string;
			};
			season: {
				label: string;
				spring: string;
				summer: string;
				autumn: string;
				winter: string;
			};
			weather: {
				label: string;
				clear: string;
				cloudy: string;
				rainy: string;
				snowy: string;
				stormy: string;
			};
			temperature: {
				label: string;
			};
		};
	};
}

const DEFAULT_CONDITIONS: WorldConditions = {
	timeOfDay: "noon",
	season: "summer",
	weather: "clear",
	weatherIntensity: "moderate",
	temperature: 20,
	daysSinceCreation: 0,
};

export default function ShiftScene({ translations }: ShiftSceneProps) {
	const [conditions, setConditions] = useState<WorldConditions>(DEFAULT_CONDITIONS);
	const t = translations.simulation;

	const updateCondition = <K extends keyof WorldConditions>(key: K, value: WorldConditions[K]) => {
		setConditions((prev) => ({ ...prev, [key]: value }));
	};

	return (
		<div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 w-full max-w-5xl mx-auto px-4">
			{/* Canvas - responsive */}
			<div className="w-full max-w-[400px]">
				<div className="rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-200 dark:ring-gray-700">
					<PixelCanvas mode="simulation" conditions={conditions} />
				</div>
			</div>

			{/* Panneau de contrôle compact 2x2 */}
			<div className="w-full max-w-[400px] lg:w-[280px] p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
				{/* Titre */}
				<h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">{t.title}</h2>

				{/* Grille 2x2 */}
				<div className="grid grid-cols-2 gap-3">
					{/* Moment du jour */}
					<ControlSelect
						label={t.timeOfDay.label}
						value={conditions.timeOfDay}
						onChange={(value) => updateCondition("timeOfDay", value as TimeOfDay)}
						options={[
							{ value: "dawn", label: t.timeOfDay.dawn },
							{ value: "morning", label: t.timeOfDay.morning },
							{ value: "noon", label: t.timeOfDay.noon },
							{ value: "afternoon", label: t.timeOfDay.afternoon },
							{ value: "dusk", label: t.timeOfDay.dusk },
							{ value: "night", label: t.timeOfDay.night },
						]}
					/>

					{/* Saison */}
					<ControlSelect
						label={t.season.label}
						value={conditions.season}
						onChange={(value) => updateCondition("season", value as Season)}
						options={[
							{ value: "spring", label: t.season.spring },
							{ value: "summer", label: t.season.summer },
							{ value: "autumn", label: t.season.autumn },
							{ value: "winter", label: t.season.winter },
						]}
					/>

					{/* Météo */}
					<ControlSelect
						label={t.weather.label}
						value={conditions.weather}
						onChange={(value) => updateCondition("weather", value as Weather)}
						options={[
							{ value: "clear", label: t.weather.clear },
							{ value: "cloudy", label: t.weather.cloudy },
							{ value: "rainy", label: t.weather.rainy },
							{ value: "snowy", label: t.weather.snowy },
							{ value: "stormy", label: t.weather.stormy },
						]}
					/>

					{/* Température */}
					<div>
						<div className="flex justify-between items-center mb-1">
							<label className="text-xs font-medium text-gray-500 dark:text-gray-400">
								{t.temperature.label}
							</label>
							<span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
								{conditions.temperature}°C
							</span>
						</div>
						<input
							type="range"
							min={-20}
							max={40}
							value={conditions.temperature}
							onChange={(e) => updateCondition("temperature", parseInt(e.target.value, 10))}
							className="w-full h-2 rounded-full appearance-none bg-gray-200 dark:bg-gray-700 cursor-pointer
								[&::-webkit-slider-thumb]:appearance-none
								[&::-webkit-slider-thumb]:w-3
								[&::-webkit-slider-thumb]:h-3
								[&::-webkit-slider-thumb]:rounded-full
								[&::-webkit-slider-thumb]:bg-sky-500
								[&::-webkit-slider-thumb]:cursor-pointer
								[&::-moz-range-thumb]:w-3
								[&::-moz-range-thumb]:h-3
								[&::-moz-range-thumb]:rounded-full
								[&::-moz-range-thumb]:bg-sky-500
								[&::-moz-range-thumb]:border-none
								[&::-moz-range-thumb]:cursor-pointer"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Composant Select compact
 */
function ControlSelect({
	label,
	value,
	onChange,
	options,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
}) {
	return (
		<div>
			<label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
				{label}
			</label>
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full px-2 py-1.5 text-xs rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 cursor-pointer"
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
}
