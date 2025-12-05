import type { Color } from "./types";
import type { WorldConditions } from "./conditions";

export const TRANSITION_DURATION_FRAMES = 90;

export function lerp(start: number, end: number, progress: number): number {
	return start + (end - start) * progress;
}

export function lerpColor(startColor: Color, endColor: Color, progress: number): Color {
	return {
		r: Math.round(lerp(startColor.r, endColor.r, progress)),
		g: Math.round(lerp(startColor.g, endColor.g, progress)),
		b: Math.round(lerp(startColor.b, endColor.b, progress)),
	};
}

export function easeInOutCubic(t: number): number {
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function conditionsHaveChanged(
	prev: WorldConditions | null,
	current: WorldConditions
): boolean {
	if (!prev) return true;

	return (
		prev.timeOfDay !== current.timeOfDay ||
		prev.season !== current.season ||
		prev.weather !== current.weather ||
		prev.temperature !== current.temperature
	);
}
