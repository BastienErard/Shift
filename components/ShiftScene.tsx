"use client";

import { useState, useEffect, useMemo } from "react";
import { PixelCanvas } from "@/components/canvas";
import { useWeather } from "@/lib/hooks/useWeather";
import { useCurrentTime } from "@/lib/hooks/useCurrentTime";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { weatherToConditions } from "@/lib/utils/conditions";
import { DEFAULT_LOCATION, createLocationFromCoords } from "@/lib/api/weather";
import type { Location } from "@/lib/api/weather";
import type { WorldConditions, TimeOfDay, Season, Weather } from "@/lib/canvas/conditions";

interface ShiftSceneProps {
	translations: {
		simulation: {
			title: string;
			mode: {
				live: string;
				manual: string;
			};
			location: string;
			myLocation: string;
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
				rain: string;
				snow: string;
				storm: string;
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
	const t = translations.simulation;

	// Mode : "live" ou "manual"
	const [mode, setMode] = useState<"live" | "manual">("live");

	// Conditions manuelles
	const [manualConditions, setManualConditions] = useState<WorldConditions>(DEFAULT_CONDITIONS);

	// Géolocalisation
	const geolocation = useGeolocation();

	// Détermine la location à utiliser
	const currentLocation: Location = useMemo(() => {
		if (geolocation.latitude && geolocation.longitude) {
			return createLocationFromCoords(geolocation.latitude, geolocation.longitude, t.myLocation);
		}
		return DEFAULT_LOCATION;
	}, [geolocation.latitude, geolocation.longitude, t.myLocation]);

	// Hooks pour le mode LIVE
	const {
		data: weatherData,
		isLoading,
		error,
	} = useWeather({
		location: currentLocation,
		enabled: mode === "live",
	});

	const { timeOfDay, formattedTime, formattedDate } = useCurrentTime(
		60 * 1000,
		weatherData?.sunrise,
		weatherData?.sunset
	);

	// Conditions finales (LIVE ou manuelles)
	const [conditions, setConditions] = useState<WorldConditions>(DEFAULT_CONDITIONS);

	// Met à jour les conditions quand le mode ou les données changent
	useEffect(() => {
		if (mode === "live" && weatherData) {
			const liveConditions = weatherToConditions(weatherData, timeOfDay, 0);
			setConditions(liveConditions);
		} else if (mode === "manual") {
			setConditions(manualConditions);
		}
	}, [mode, weatherData, timeOfDay, manualConditions]);

	const updateManualCondition = <K extends keyof WorldConditions>(
		key: K,
		value: WorldConditions[K]
	) => {
		setManualConditions((prev) => ({ ...prev, [key]: value }));
	};

	// Détermine le texte de localisation à afficher
	const locationDisplay = useMemo(() => {
		if (geolocation.isLoading) {
			return "📍 Localisation...";
		}
		if (geolocation.error || !geolocation.latitude) {
			return `📍 ${DEFAULT_LOCATION.name}`;
		}
		return `📍 ${t.myLocation}`;
	}, [geolocation, t.myLocation]);

	return (
		<div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 w-full max-w-5xl mx-auto px-4">
			{/* Canvas */}
			<div className="w-full max-w-[400px] rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-200 dark:ring-gray-700">
				<PixelCanvas mode="simulation" conditions={conditions} />
			</div>

			{/* Panneau de contrôle */}
			<div className="w-full max-w-[400px] lg:w-[300px] p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
				{/* Toggle LIVE / Manuel */}
				<div className="flex rounded-lg bg-gray-100 dark:bg-gray-900 p-1 mb-4">
					<button
						onClick={() => setMode("live")}
						className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
							mode === "live"
								? "bg-sky-500 text-white shadow-sm"
								: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
						}`}
					>
						🔴 {t.mode.live}
					</button>
					<button
						onClick={() => setMode("manual")}
						className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
							mode === "manual"
								? "bg-sky-500 text-white shadow-sm"
								: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
						}`}
					>
						⚙️ {t.mode.manual}
					</button>
				</div>

				{/* Mode LIVE : Infos en temps réel */}
				{mode === "live" && (
					<div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
						{isLoading ? (
							<p className="text-xs text-gray-500 dark:text-gray-400 text-center">Chargement...</p>
						) : error ? (
							<p className="text-xs text-red-500 text-center">Erreur de connexion</p>
						) : (
							<div className="space-y-1">
								<div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
									<span>{locationDisplay}</span>
								</div>
								<div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
									<span>📅</span>
									<span>{formattedDate}</span>
								</div>
								<div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
									<span>🕐</span>
									<span>{formattedTime}</span>
								</div>
								{weatherData && (
									<div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
										<span>🌡️</span>
										<span>{weatherData.temperature}°C</span>
									</div>
								)}
							</div>
						)}
					</div>
				)}

				{/* Mode MANUEL : Contrôles */}
				{mode === "manual" && (
					<div className="grid grid-cols-2 gap-3">
						{/* Moment du jour */}
						<ControlSelect
							label={t.timeOfDay.label}
							value={manualConditions.timeOfDay}
							onChange={(value) => updateManualCondition("timeOfDay", value as TimeOfDay)}
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
							value={manualConditions.season}
							onChange={(value) => updateManualCondition("season", value as Season)}
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
							value={manualConditions.weather}
							onChange={(value) => updateManualCondition("weather", value as Weather)}
							options={[
								{ value: "clear", label: t.weather.clear },
								{ value: "cloudy", label: t.weather.cloudy },
								{ value: "rain", label: t.weather.rain },
								{ value: "snow", label: t.weather.snow },
								{ value: "storm", label: t.weather.storm },
							]}
						/>

						{/* Température */}
						<div>
							<div className="flex justify-between items-center mb-1">
								<label className="text-xs font-medium text-gray-500 dark:text-gray-400">
									{t.temperature.label}
								</label>
								<span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
									{manualConditions.temperature}°C
								</span>
							</div>
							<input
								type="range"
								min={-20}
								max={40}
								value={manualConditions.temperature}
								onChange={(e) => updateManualCondition("temperature", parseInt(e.target.value, 10))}
								className="w-full h-2 rounded-full appearance-none bg-gray-200 dark:bg-gray-700 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sky-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-sky-500 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer"
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

/* Composant Select compact */
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
