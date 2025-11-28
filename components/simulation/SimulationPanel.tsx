"use client";

import { Slider, Select, Card } from "@/components/ui";
import type { WorldConditions, TimeOfDay, Season, Weather } from "@/lib/canvas/conditions";

interface SimulationPanelProps {
	conditions: WorldConditions;
	onChange: (conditions: WorldConditions) => void;
	translations: {
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
}

export default function SimulationPanel({
	conditions,
	onChange,
	translations,
}: SimulationPanelProps) {
	const t = translations;

	// Options pour les selects
	const timeOfDayOptions = [
		{ value: "dawn", label: t.timeOfDay.dawn },
		{ value: "morning", label: t.timeOfDay.morning },
		{ value: "noon", label: t.timeOfDay.noon },
		{ value: "afternoon", label: t.timeOfDay.afternoon },
		{ value: "dusk", label: t.timeOfDay.dusk },
		{ value: "night", label: t.timeOfDay.night },
	];

	const seasonOptions = [
		{ value: "spring", label: t.season.spring },
		{ value: "summer", label: t.season.summer },
		{ value: "autumn", label: t.season.autumn },
		{ value: "winter", label: t.season.winter },
	];

	const weatherOptions = [
		{ value: "clear", label: t.weather.clear },
		{ value: "cloudy", label: t.weather.cloudy },
		{ value: "rainy", label: t.weather.rainy },
		{ value: "snowy", label: t.weather.snowy },
		{ value: "stormy", label: t.weather.stormy },
	];

	// Handlers
	const handleTimeOfDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		onChange({ ...conditions, timeOfDay: e.target.value as TimeOfDay });
	};

	const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		onChange({ ...conditions, season: e.target.value as Season });
	};

	const handleWeatherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		onChange({ ...conditions, weather: e.target.value as Weather });
	};

	const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange({ ...conditions, temperature: parseInt(e.target.value, 10) });
	};

	return (
		<Card title={t.title} padding="md" className="w-full max-w-md">
			<div className="flex flex-col gap-5">
				{/* Moment du jour */}
				<Select
					label={t.timeOfDay.label}
					options={timeOfDayOptions}
					value={conditions.timeOfDay}
					onChange={handleTimeOfDayChange}
				/>

				{/* Saison */}
				<Select
					label={t.season.label}
					options={seasonOptions}
					value={conditions.season}
					onChange={handleSeasonChange}
				/>

				{/* Météo */}
				<Select
					label={t.weather.label}
					options={weatherOptions}
					value={conditions.weather}
					onChange={handleWeatherChange}
				/>

				{/* Température */}
				<Slider
					label={t.temperature.label}
					min={-20}
					max={40}
					value={conditions.temperature}
					onChange={handleTemperatureChange}
					displayValue={`${conditions.temperature}°C`}
					showMinMax
					minLabel="-20°C"
					maxLabel="40°C"
				/>
			</div>
		</Card>
	);
}
