"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { Scene } from "@/lib/canvas/types";
import {
	CANVAS_WIDTH,
	CANVAS_HEIGHT,
	DISPLAY_WIDTH,
	DISPLAY_HEIGHT,
	rgb,
} from "@/lib/canvas/types";
import { renderScene, fillCanvas, drawText } from "@/lib/canvas/renderer";
import { buildTestScene, buildSceneFromCurrentTime } from "@/lib/canvas/builder";

/* Props du composant PixelCanvas */
interface PixelCanvasProps {
	/* Mode de rendu
	 * - "live" : Utilise l'heure système (production)
	 * - "test" : Utilise un preset de test */
	mode?: "live" | "test";

	/* Preset de test (si mode = "test") */
	testPreset?: "sunny" | "night" | "rainy" | "snowy";

	/* Classe CSS additionnelle */
	className?: string;
}

/* Composant PixelCanvas */
export default function PixelCanvas({
	mode = "test",
	testPreset = "sunny",
	className = "",
}: PixelCanvasProps) {
	const t = useTranslations("canvas");

	/* Référence vers l'élément canvas */
	const canvasRef = useRef<HTMLCanvasElement>(null);

	/* État d'erreur */
	const [error, setError] = useState<string | null>(null);

	/* Effet de rendu */
	useEffect(() => {
		// Récupère l'élément canvas
		const canvas = canvasRef.current;

		if (!canvas) {
			setError("Canvas non disponible");
			return;
		}

		/* Obtient le contexte 2D */
		const ctx = canvas.getContext("2d");

		if (!ctx) {
			setError("Contexte 2D non supporté");
			return;
		}

		try {
			/* Construit la scène selon le mode*/
			let scene: Scene;

			if (mode === "live") {
				// Mode production : utilise l'heure système
				scene = buildSceneFromCurrentTime();
			} else {
				// Mode test : utilise le preset choisi
				scene = buildTestScene(testPreset);
			}
			/* Rend la scène sur le canvas */
			renderScene(ctx, scene);

			// Marque comme chargé
			setError(null);
		} catch (err) {
			console.error("Erreur de rendu :", err);
			setError("Erreur lors du rendu de la scène");
		}
	}, [mode, testPreset]);

	return (
		<div className={`relative ${className}`}>
			{/* Élément Canvas*/}
			<canvas
				ref={canvasRef}
				width={CANVAS_WIDTH}
				height={CANVAS_HEIGHT}
				style={{
					width: DISPLAY_WIDTH,
					height: DISPLAY_HEIGHT,
				}}
				className="border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg"
				aria-label={t("ariaLabel")}
				role="img"
			/>

			{/**
			 * Message d'erreur
			 */}
			{error && (
				<div className="absolute inset-0 flex items-center justify-center bg-red-100 dark:bg-red-900 rounded-lg">
					<p className="text-red-600 dark:text-red-200 text-sm">{error}</p>
				</div>
			)}
		</div>
	);
}
