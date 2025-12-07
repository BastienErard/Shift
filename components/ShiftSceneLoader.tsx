"use client";

import dynamic from "next/dynamic";

// Lazy load du composant principal (améliore le LCP)
const ShiftScene = dynamic(() => import("@/components/ShiftScene"), {
	ssr: false,
	loading: () => (
		<div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 w-full max-w-5xl mx-auto px-4">
			{/* Skeleton du Canvas */}
			<div className="w-full max-w-[400px] h-[300px] rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 bg-gradient-to-b from-sky-200 to-green-300 dark:from-sky-900 dark:to-green-800 animate-pulse" />
			{/* Skeleton du panneau de contrôle */}
			<div className="w-full max-w-[400px] lg:w-[300px] h-[200px] p-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg animate-pulse" />
		</div>
	),
});

interface ShiftSceneLoaderProps {
	translations: {
		simulation: {
			title: string;
			mode: {
				live: string;
				manual: string;
			};
			location: string;
			myLocation: string;
			cloudCover?: string;
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
			wind?: {
				label?: string;
				speed?: string;
				direction?: string;
				directions?: {
					none?: string;
					left?: string;
					right?: string;
				};
			};
		};
	};
}

export default function ShiftSceneLoader({ translations }: ShiftSceneLoaderProps) {
	return <ShiftScene translations={translations} />;
}
