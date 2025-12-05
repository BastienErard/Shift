/**
 * Calcule le décalage horizontal causé par le vent
 *
 * @param windSpeed Vitesse du vent en km/h
 * @param windDirection Direction du vent en degrés (0-360)
 * @param heightFactor Facteur de hauteur (plus haut = plus affecté)
 * @returns Décalage X en pixels (négatif = gauche, positif = droite)
 */
export function calculateWindOffset(
	windSpeed: number = 0,
	windDirection: number = 0,
	heightFactor: number = 1
): number {
	if (windSpeed < 5) return 0;

	const radians = (windDirection * Math.PI) / 180;
	const horizontalComponent = Math.sin(radians);

	// 🆕 Augmente encore l'effet (x4 au lieu de x2.5)
	// 10 km/h = décalage de 4
	// 30 km/h = décalage de 12
	// 50 km/h = décalage de 20
	const windStrength = Math.min(windSpeed / 2.5, 20);

	return -horizontalComponent * windStrength * heightFactor;
}

/**
 * Obtient un label textuel de la direction du vent
 */
export function getWindDirectionLabel(direction: number): string {
	if (direction >= 337.5 || direction < 22.5) return "N";
	if (direction >= 22.5 && direction < 67.5) return "NE";
	if (direction >= 67.5 && direction < 112.5) return "E";
	if (direction >= 112.5 && direction < 157.5) return "SE";
	if (direction >= 157.5 && direction < 202.5) return "S";
	if (direction >= 202.5 && direction < 247.5) return "SW";
	if (direction >= 247.5 && direction < 292.5) return "W";
	return "NW";
}
