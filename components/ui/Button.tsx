"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

/* Variantes visuelles du bouton */
type ButtonVariant = "primary" | "secondary" | "ghost";

/* Tailles du bouton */
type ButtonSize = "sm" | "md" | "lg";

/* Props du composant Button */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	isLoading?: boolean;
}

/* Classes Tailwind pour chaque variante */
const variantClasses: Record<ButtonVariant, string> = {
	primary: `
		bg-blue-500 text-white
		hover:bg-blue-600
		active:bg-blue-700
		disabled:bg-blue-300 disabled:cursor-not-allowed
		shadow-md hover:shadow-lg
	`,
	secondary: `
		bg-gray-200 text-gray-800
		dark:bg-gray-700 dark:text-gray-200
		hover:bg-gray-300 dark:hover:bg-gray-600
		active:bg-gray-400 dark:active:bg-gray-500
		disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
		dark:disabled:bg-gray-800 dark:disabled:text-gray-600
	`,
	ghost: `
		bg-transparent text-gray-700
		dark:text-gray-300
		hover:bg-gray-100 dark:hover:bg-gray-800
		active:bg-gray-200 dark:active:bg-gray-700
		disabled:text-gray-300 disabled:cursor-not-allowed
	`,
};

/* Classes Tailwind pour chaque taille */
const sizeClasses: Record<ButtonSize, string> = {
	sm: "px-3 py-1.5 text-sm",
	md: "px-4 py-2 text-sm",
	lg: "px-6 py-3 text-base",
};

/* Composant Button */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant = "primary",
			size = "md",
			isLoading = false,
			disabled,
			className = "",
			children,
			...props
		},
		ref
	) => {
		return (
			<button
				ref={ref}
				disabled={disabled || isLoading}
				className={`
					inline-flex items-center justify-center gap-2
					font-medium rounded-lg
					transition-all duration-200
					focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
					dark:focus:ring-offset-gray-900
					${variantClasses[variant]}
					${sizeClasses[size]}
					${className}
				`}
				{...props}
			>
				{isLoading && (
					<svg
						className="animate-spin h-4 w-4"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						/>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
				)}
				{children}
			</button>
		);
	}
);

/* displayName est requis avec forwardRef */
Button.displayName = "Button";

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };
