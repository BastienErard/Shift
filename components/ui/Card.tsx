"use client";

import { type HTMLAttributes, forwardRef } from "react";

/* Props du composant Card */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
	/* Titre de la card (optionnel) */
	title?: string;

	/* Sous-titre ou description (optionnel) */
	subtitle?: string;

	/* Variante de padding */
	padding?: "none" | "sm" | "md" | "lg";

	/* Ajouter une ombre portée */
	shadow?: boolean;
}

/* Classes de padding selon la variante */
const paddingClasses = {
	none: "",
	sm: "p-4",
	md: "p-6",
	lg: "p-8",
};

/* Composant Card */
const Card = forwardRef<HTMLDivElement, CardProps>(
	({ title, subtitle, padding = "md", shadow = true, className = "", children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={`
					bg-white dark:bg-gray-800
					border border-gray-200 dark:border-gray-700
					rounded-xl
					${shadow ? "shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50" : ""}
					${paddingClasses[padding]}
					${className}
				`}
				{...props}
			>
				{/* Header (titre + sous-titre) */}
				{(title || subtitle) && (
					<div className={`${padding !== "none" ? "mb-4" : "p-6 pb-0"}`}>
						{title && (
							<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
						)}
						{subtitle && (
							<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
						)}
					</div>
				)}

				{/* Contenu */}
				{children}
			</div>
		);
	}
);

Card.displayName = "Card";

/* Composant CardSection */
interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
	/* Titre de la section */
	title?: string;

	/* Ajouter une bordure en haut */
	border?: boolean;
}

const CardSection = forwardRef<HTMLDivElement, CardSectionProps>(
	({ title, border = false, className = "", children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={`
					${border ? "border-t border-gray-200 dark:border-gray-700 pt-4 mt-4" : ""}
					${className}
				`}
				{...props}
			>
				{title && (
					<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{title}</h3>
				)}
				{children}
			</div>
		);
	}
);

CardSection.displayName = "CardSection";

export { Card, CardSection, type CardProps, type CardSectionProps };
