import type { Config } from "tailwindcss";

const config: Config = {
	// 🌓 Active le mode sombre via classe CSS
	darkMode: "class",

	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],

	theme: {
		extend: {
			// On pourra ajouter des couleurs custom ici plus tard
		},
	},

	plugins: [],
};

export default config;
