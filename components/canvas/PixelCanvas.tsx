"use client";

import { useEffect, useRef, useState } from "react";
import { buildScene, buildTestScene } from "@/lib/canvas/builder";
import { renderScene } from "@/lib/canvas/renderer";
import type { Scene } from "@/lib/canvas/types";
import type { WorldConditions } from "@/lib/canvas/conditions";
import type { TestPreset } from "@/lib/canvas/test-presets";
import { getSkyColor, getGroundColor } from "@/lib/canvas/palette";
import {
	lerpColor,
	easeInOutCubic,
	conditionsHaveChanged,
	TRANSITION_DURATION_FRAMES,
} from "@/lib/canvas/transitions";
import type { Color } from "@/lib/canvas/types";

// Throttle à 30 FPS (suffisant pour du pixel art, réduit la charge CPU)
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

interface PixelCanvasProps {
	mode?: "hero" | "simulation" | "test";
	testPreset?: TestPreset;
	conditions?: WorldConditions;
}

export function PixelCanvas({ mode = "hero", testPreset = "sunny", conditions }: PixelCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationFrameRef = useRef<number | undefined>(undefined);
	const smokeOffsetRef = useRef<number>(0);
	const lastFrameTimeRef = useRef<number>(0);

	// State de transition
	const transitionRef = useRef<{
		isTransitioning: boolean;
		currentFrame: number;
		prevConditions: WorldConditions | null;
		prevSkyColor: Color | null;
		prevGroundColor: Color | null;
	}>({
		isTransitioning: false,
		currentFrame: 0,
		prevConditions: null,
		prevSkyColor: null,
		prevGroundColor: null,
	});

	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;

		if (!canvas) {
			setError("Canvas non disponible");
			return;
		}

		const ctx = canvas.getContext("2d");

		if (!ctx) {
			setError("Contexte 2D non supporté");
			return;
		}

		const animate = (currentTime: number) => {
			// Throttle à 30 FPS pour économiser les ressources
			const elapsed = currentTime - lastFrameTimeRef.current;
			if (elapsed < FRAME_INTERVAL) {
				animationFrameRef.current = requestAnimationFrame(animate);
				return;
			}
			lastFrameTimeRef.current = currentTime - (elapsed % FRAME_INTERVAL);

			try {
				let scene: Scene;
				let finalSkyColor: Color;
				let finalGroundColor: Color;

				if (mode === "simulation" && conditions) {
					// Détecte si les conditions ont changé
					if (conditionsHaveChanged(transitionRef.current.prevConditions, conditions)) {
						// Démarre une transition
						if (!transitionRef.current.isTransitioning) {
							transitionRef.current.isTransitioning = true;
							transitionRef.current.currentFrame = 0;
							transitionRef.current.prevSkyColor = transitionRef.current.prevConditions
								? getSkyColor(transitionRef.current.prevConditions)
								: getSkyColor(conditions);
							transitionRef.current.prevGroundColor = transitionRef.current.prevConditions
								? getGroundColor(transitionRef.current.prevConditions)
								: getGroundColor(conditions);
						}
					}

					// Calcule les couleurs avec transition
					if (transitionRef.current.isTransitioning) {
						const progress = Math.min(
							transitionRef.current.currentFrame / TRANSITION_DURATION_FRAMES,
							1
						);
						const easedProgress = easeInOutCubic(progress);

						const targetSkyColor = getSkyColor(conditions);
						const targetGroundColor = getGroundColor(conditions);

						finalSkyColor = lerpColor(
							transitionRef.current.prevSkyColor!,
							targetSkyColor,
							easedProgress
						);

						finalGroundColor = lerpColor(
							transitionRef.current.prevGroundColor!,
							targetGroundColor,
							easedProgress
						);

						// Incrémente le compteur de transition
						transitionRef.current.currentFrame++;

						// Fin de la transition
						if (progress >= 1) {
							transitionRef.current.isTransitioning = false;
							transitionRef.current.prevConditions = { ...conditions };
						}
					} else {
						// Pas de transition en cours
						finalSkyColor = getSkyColor(conditions);
						finalGroundColor = getGroundColor(conditions);
						transitionRef.current.prevConditions = { ...conditions };
					}

					// Construit la scène avec les couleurs interpolées
					scene = buildScene(
						conditions,
						conditions.cloudCover,
						smokeOffsetRef.current,
						smokeOffsetRef.current
					);

					// Remplace les couleurs de la scène
					scene.skyColor = finalSkyColor;
					scene.groundColor = finalGroundColor;
				} else if (mode === "test") {
					scene = buildTestScene(testPreset);
				} else {
					scene = buildTestScene("sunny");
				}

				renderScene(ctx, scene);

				// Incrémente l'offset d'animation
				smokeOffsetRef.current += 0.5;

				setError(null);
				animationFrameRef.current = requestAnimationFrame(animate);
			} catch (err) {
				console.error("Erreur de rendu:", err);
				setError("Erreur lors du rendu");
			}
		};

		animationFrameRef.current = requestAnimationFrame(animate);

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [mode, testPreset, conditions]);

	return (
		<div className="relative w-full h-full">
			<canvas
				ref={canvasRef}
				width={800}
				height={600}
				className="w-full h-full"
				style={{
					imageRendering: "pixelated",
				}}
			/>
			{error && (
				<div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20">
					<p className="text-sm text-red-600 dark:text-red-400">{error}</p>
				</div>
			)}
		</div>
	);
}
