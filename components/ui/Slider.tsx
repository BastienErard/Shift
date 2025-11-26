"use client";

import { type InputHTMLAttributes, forwardRef, useId } from "react";

/* Props du composant Slider */
interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
	/* Label affiché au-dessus du slider */
	label: string;

	/* Valeur actuelle (affichée à droite) */
	displayValue?: string;

	/* Afficher les valeurs min/max sous le slider */
	showMinMax?: boolean;

	/* Label pour la valeur min */
	minLabel?: string;

	/* Label pour la valeur max */
	maxLabel?: string;
}

/* Composant Slider */
const Slider = forwardRef<HTMLInputElement, SliderProps>(
	(
		{
			label,
			displayValue,
			showMinMax = false,
			minLabel,
			maxLabel,
			min = 0,
			max = 100,
			className = "",
			id: providedId,
			...props
		},
		ref
	) => {
		/* useId() génère un ID unique côté client ET serveur */
		const generatedId = useId();
		const id = providedId ?? generatedId;

		return (
			<div className="w-full">
				{/* Label + Valeur actuelle */}
				<div className="flex justify-between items-center mb-2">
					<label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
						{label}
					</label>
					{displayValue && (
						<span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
							{displayValue}
						</span>
					)}
				</div>

				{/* Slider */}
				<input
					ref={ref}
					type="range"
					id={id}
					min={min}
					max={max}
					className={`
						w-full h-2 rounded-full appearance-none cursor-pointer
						bg-gray-200 dark:bg-gray-700

						/* Thumb (le curseur) - Webkit (Chrome, Safari) */
						[&::-webkit-slider-thumb]:appearance-none
						[&::-webkit-slider-thumb]:w-5
						[&::-webkit-slider-thumb]:h-5
						[&::-webkit-slider-thumb]:rounded-full
						[&::-webkit-slider-thumb]:bg-blue-500
						[&::-webkit-slider-thumb]:hover:bg-blue-600
						[&::-webkit-slider-thumb]:active:bg-blue-700
						[&::-webkit-slider-thumb]:shadow-md
						[&::-webkit-slider-thumb]:transition-colors
						[&::-webkit-slider-thumb]:duration-200

						/* Thumb - Firefox */
						[&::-moz-range-thumb]:w-5
						[&::-moz-range-thumb]:h-5
						[&::-moz-range-thumb]:rounded-full
						[&::-moz-range-thumb]:bg-blue-500
						[&::-moz-range-thumb]:hover:bg-blue-600
						[&::-moz-range-thumb]:active:bg-blue-700
						[&::-moz-range-thumb]:border-none
						[&::-moz-range-thumb]:shadow-md
						[&::-moz-range-thumb]:transition-colors
						[&::-moz-range-thumb]:duration-200

						/* Track - Firefox */
						[&::-moz-range-track]:bg-gray-200
						[&::-moz-range-track]:dark:bg-gray-700
						[&::-moz-range-track]:rounded-full
						[&::-moz-range-track]:h-2

						/* Focus */
						focus:outline-none
						focus:ring-2
						focus:ring-blue-500
						focus:ring-offset-2
						dark:focus:ring-offset-gray-900

						${className}
					`}
					{...props}
				/>

				{/* Min/Max labels */}
				{showMinMax && (
					<div className="flex justify-between mt-1">
						<span className="text-xs text-gray-500 dark:text-gray-400">{minLabel ?? min}</span>
						<span className="text-xs text-gray-500 dark:text-gray-400">{maxLabel ?? max}</span>
					</div>
				)}
			</div>
		);
	}
);

Slider.displayName = "Slider";

export { Slider, type SliderProps };
