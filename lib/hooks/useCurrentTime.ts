"use client";

import { useState, useEffect } from "react";
import type { TimeOfDay } from "@/lib/canvas/conditions";

interface UseCurrentTimeReturn {
	currentTime: Date;
	timeOfDay: TimeOfDay;
	formattedTime: string;
	formattedDate: string;
}

/* Détermine le moment de la journée basé sur l'heure */
function getTimeOfDay(date: Date, sunrise?: Date, sunset?: Date): TimeOfDay {
	const hour = date.getHours();

	// Si on a sunrise/sunset, utiliser des calculs précis
	if (sunrise && sunset) {
		const sunriseHour = sunrise.getHours();
		const sunsetHour = sunset.getHours();

		// Aube : 1h avant sunrise jusqu'à sunrise
		if (hour >= sunriseHour - 1 && hour < sunriseHour) return "dawn";

		// Matin : sunrise jusqu'à 12h
		if (hour >= sunriseHour && hour < 12) return "morning";

		// Midi : 12h - 14h
		if (hour >= 12 && hour < 14) return "noon";

		// Après-midi : 14h jusqu'à 1h avant sunset
		if (hour >= 14 && hour < sunsetHour - 1) return "afternoon";

		// Crépuscule : 1h avant sunset jusqu'à sunset
		if (hour >= sunsetHour - 1 && hour < sunsetHour + 1) return "dusk";

		// Nuit : après sunset ou avant dawn
		return "night";
	}

	// Fallback : calcul simple basé sur l'heure
	if (hour >= 5 && hour < 7) return "dawn";
	if (hour >= 7 && hour < 12) return "morning";
	if (hour >= 12 && hour < 14) return "noon";
	if (hour >= 14 && hour < 18) return "afternoon";
	if (hour >= 18 && hour < 21) return "dusk";
	return "night";
}

/* Hook pour obtenir l'heure actuelle et le moment de la journée */
export function useCurrentTime(
	updateInterval = 60 * 1000, // 1 minute
	sunrise?: Date,
	sunset?: Date
): UseCurrentTimeReturn {
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, updateInterval);

		return () => clearInterval(interval);
	}, [updateInterval]);

	const timeOfDay = getTimeOfDay(currentTime, sunrise, sunset);

	// Formatage de l'heure (ex: "22:45")
	const formattedTime = currentTime.toLocaleTimeString("fr-CH", {
		hour: "2-digit",
		minute: "2-digit",
	});

	// Formatage de la date (ex: "26 nov. 2024")
	const formattedDate = currentTime.toLocaleDateString("fr-CH", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});

	return {
		currentTime,
		timeOfDay,
		formattedTime,
		formattedDate,
	};
}
