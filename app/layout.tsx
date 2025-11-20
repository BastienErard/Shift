import "./globals.css";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								const savedTheme = localStorage.getItem('theme');
								const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
								const theme = savedTheme || systemTheme;

								if (theme === 'dark') {
								document.documentElement.classList.add('dark');
								}
							})();
						`,
					}}
				/>
			</head>
			<body>{children}</body>
		</html>
	);
}
