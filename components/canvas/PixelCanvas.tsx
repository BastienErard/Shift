"use client";

import { useRef, useEffect, useState } from "react";
import type { Scene } from "@/lib/canvas/types";
import type { WorldConditions } from "@/lib/canvas/conditions";
import { CANVAS_WIDTH, CANVAS_HEIGHT, DISPLAY_WIDTH, DISPLAY_HEIGHT } from "@/lib/canvas/types";
import { renderScene } from "@/lib/canvas/renderer";
import { buildTestScene, buildScene } from "@/lib/canvas/builder";

interface PixelCanvasProps {
	mode?: "test" | "simulation" | "live";
	testPreset?: "sunny" | "night" | "rainy" | "snowy";
	conditions?: WorldConditions;
	className?: string;
}

export default function PixelCanvas({
	mode = "test",
	testPreset = "sunny",
	conditions,
	className = "",
}: PixelCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
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

		try {
			let scene: Scene;

			if (mode === "simulation" && conditions) {
				scene = buildScene(conditions);
			} else if (mode === "test") {
				scene = buildTestScene(testPreset);
			} else {
				scene = buildTestScene("sunny");
			}

			renderScene(ctx, scene);
			setError(null);
		} catch (err) {
			console.error("Erreur de rendu:", err);
			setError("Erreur lors du rendu");
		}
	}, [mode, testPreset, conditions]);

	return (
		<div className={`relative w-full ${className}`}>
			{/*
				Aspect ratio container :
				Le canvas a un ratio de 400:300 = 4:3
				On utilise aspect-[4/3] pour maintenir ce ratio
			*/}
			<div className="relative w-full aspect-[4/3]">
				<canvas
					ref={canvasRef}
					width={CANVAS_WIDTH}
					height={CANVAS_HEIGHT}
					className="absolute inset-0 w-full h-full"
					style={{
						imageRendering: "pixelated", // Garde les pixels nets
					}}
					aria-label="Scène pixel art évolutive de Shift"
					role="img"
				/>
			</div>

			{error && (
				<div className="absolute inset-0 flex items-center justify-center bg-red-100 dark:bg-red-900 rounded-lg">
					<p className="text-red-600 dark:text-red-200 text-sm">{error}</p>
				</div>
			)}
		</div>
	);
}
