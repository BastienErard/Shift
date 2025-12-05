// ============================================================================
// MOMENT DE LA JOURNÉE
// ============================================================================

/* Les 6 moments de la journée */
export type TimeOfDay = "dawn" | "morning" | "noon" | "afternoon" | "dusk" | "night";

/* Ordre des moments (pour les transitions) */
export const TIME_OF_DAY_ORDER: TimeOfDay[] = [
	"dawn",
	"morning",
	"noon",
	"afternoon",
	"dusk",
	"night",
];

/* Plages horaires pour chaque moment (heures 0-23) */
export const TIME_OF_DAY_HOURS: Record<TimeOfDay, { start: number; end: number }> = {
	dawn: { start: 5, end: 7 },
	morning: { start: 7, end: 12 },
	noon: { start: 12, end: 14 },
	afternoon: { start: 14, end: 18 },
	dusk: { start: 18, end: 21 },
	night: { start: 21, end: 5 }, // Note : passe par minuit
};

// ============================================================================
// SAISONS
// ============================================================================

/* Les 4 saisons */
export type Season = "spring" | "summer" | "autumn" | "winter";

/* Ordre des saisons (utile pour les transitions) */
export const SEASON_ORDER: Season[] = ["spring", "summer", "autumn", "winter"];

/* Mois correspondants à chaque saison (hémisphère nord) */
export const SEASON_MONTHS: Record<Season, number[]> = {
	spring: [2, 3, 4], // Mars, Avril, Mai
	summer: [5, 6, 7], // Juin, Juillet, Août
	autumn: [8, 9, 10], // Septembre, Octobre, Novembre
	winter: [11, 0, 1], // Décembre, Janvier, Février
};

// ============================================================================
// MÉTÉO
// ============================================================================

/* Types de météo supportés */
export type Weather = "clear" | "cloudy" | "rain" | "snow" | "storm";

/* Intensité des phénomènes météo) */
export type WeatherIntensity = "light" | "moderate" | "heavy";

// ============================================================================
// CONDITIONS COMPLÈTES DU MONDE
// ============================================================================

/* État complet des conditions du monde */
export interface WorldConditions {
	/* Moment de la journée */
	timeOfDay: TimeOfDay;

	/*Saison actuelle */
	season: Season;

	/* Type de météo */
	weather: Weather;

	/* Intensité de la météo */
	weatherIntensity: WeatherIntensity;

	/* Température en degrés Celsius */
	temperature: number;

	/* Nombre de jours depuis la création du monde */
	daysSinceCreation: number;

	/* Couverture nuageuse en % (optionnel, pour mode LIVE) */
	cloudCover?: number; // 🆕
}

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/* Détermine le moment de la journée depuis une heure (0-23)
 * @param hour Heure actuelle (0-23)
 * @returns Le moment de la journée correspondant */
export function getTimeOfDayFromHour(hour: number): TimeOfDay {
	// Normalise l'heure
	const normalizedHour = ((hour % 24) + 24) % 24;

	// Cas spécial : la nuit chevauche minuit
	if (normalizedHour >= 21 || normalizedHour < 5) {
		return "night";
	}

	// Parcourt les autres moments
	for (const time of TIME_OF_DAY_ORDER) {
		if (time === "night") continue;

		const { start, end } = TIME_OF_DAY_HOURS[time];
		if (normalizedHour >= start && normalizedHour < end) {
			return time;
		}
	}

	// Fallback (ne devrait jamais arriver)
	return "noon";
}

/**
 * Détermine la saison depuis un mois (0-11)
 *
 * @param month Mois actuel (0 = Janvier, 11 = Décembre)
 * @returns La saison correspondante */
export function getSeasonFromMonth(month: number): Season {
	// Normalise le mois
	const normalizedMonth = ((month % 12) + 12) % 12;

	for (const season of SEASON_ORDER) {
		if (SEASON_MONTHS[season].includes(normalizedMonth)) {
			return season;
		}
	}

	// Fallback (ne devrait jamais arriver)
	return "summer";
}

/* Crée des conditions par défaut (jour ensoleillé d'été) - Fallback si l'API météo échoue */
export function createDefaultConditions(): WorldConditions {
	return {
		timeOfDay: "noon",
		season: "summer",
		weather: "clear",
		weatherIntensity: "moderate",
		temperature: 22,
		daysSinceCreation: 0,
	};
}

/* Crée des conditions depuis la date et l'heure actuelles
 *
 * 🎓 Ne prend PAS en compte la météo réelle (à ajouter via API)
 *
 * @param date Date à utiliser (par défaut : maintenant)
 * @param creationDate Date de création du monde (pour daysSinceCreation)
 */
export function createConditionsFromDate(
	date: Date = new Date(),
	creationDate: Date = new Date()
): WorldConditions {
	const hour = date.getHours();
	const month = date.getMonth();

	// Calcule le nombre de jours depuis la création
	const msPerDay = 1000 * 60 * 60 * 24;
	const daysSinceCreation = Math.floor((date.getTime() - creationDate.getTime()) / msPerDay);

	return {
		timeOfDay: getTimeOfDayFromHour(hour),
		season: getSeasonFromMonth(month),
		weather: "clear", // Par défaut, sera mis à jour par l'API météo
		weatherIntensity: "moderate",
		temperature: 20, // Par défaut, sera mis à jour par l'API météo
		daysSinceCreation: Math.max(0, daysSinceCreation),
	};
}

/* Vérifie si c'est la nuit */
export function isNight(conditions: WorldConditions): boolean {
	return conditions.timeOfDay === "night";
}

/* Vérifie si c'est un moment de lumière dorée (aube ou crépuscule) */
export function isGoldenHour(conditions: WorldConditions): boolean {
	return conditions.timeOfDay === "dawn" || conditions.timeOfDay === "dusk";
}

/* Vérifie s'il y a des précipitations */
export function hasPrecipitation(conditions: WorldConditions): boolean {
	return (
		conditions.weather === "rain" || conditions.weather === "snow" || conditions.weather === "storm"
	);
}

/* Vérifie si le sol devrait être enneigé */
export function hasSnowOnGround(conditions: WorldConditions): boolean {
	return (
		conditions.season === "winter" && (conditions.weather === "snow" || conditions.temperature < 2)
	);
}
