"use client";

import { type SelectHTMLAttributes, forwardRef, useId } from "react";

/* Option d'un select */
interface SelectOption {
	value: string;
	label: string;
}

/* Props du composant Select */
interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
	/* Label affiché au-dessus du select */
	label: string;

	/* Options disponibles */
	options: SelectOption[];

	/* Placeholder (première option désactivée) */
	placeholder?: string;
}

/* Composant Select */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
	({ label, options, placeholder, className = "", id: providedId, ...props }, ref) => {
		const generatedId = useId();
		const id = providedId ?? generatedId;

		return (
			<div className="w-full">
				{/* Label */}
				<label
					htmlFor={id}
					className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
				>
					{label}
				</label>

				{/* Select wrapper (pour positionner l'icône) */}
				<div className="relative">
					<select
						ref={ref}
						id={id}
						className={`
							w-full px-4 py-2.5 pr-10
							text-sm font-medium
							text-gray-700 dark:text-gray-200
							bg-white dark:bg-gray-800
							border border-gray-300 dark:border-gray-600
							rounded-lg
							appearance-none
							cursor-pointer
							transition-colors duration-200

							hover:border-gray-400 dark:hover:border-gray-500

							focus:outline-none
							focus:ring-2
							focus:ring-blue-500
							focus:border-blue-500

							disabled:bg-gray-100 dark:disabled:bg-gray-900
							disabled:text-gray-400 dark:disabled:text-gray-600
							disabled:cursor-not-allowed

							${className}
						`}
						{...props}
					>
						{/* Placeholder */}
						{placeholder && (
							<option value="" disabled>
								{placeholder}
							</option>
						)}

						{/* Options */}
						{options.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>

					{/* Icône chevron */}
					<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
						<svg
							className="w-4 h-4 text-gray-500 dark:text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</div>
				</div>
			</div>
		);
	}
);

Select.displayName = "Select";

export { Select, type SelectProps, type SelectOption };
